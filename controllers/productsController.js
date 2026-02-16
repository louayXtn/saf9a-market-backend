
const verifyJWT = require("../middleware/verifyJWT");

const Product = require("../models/Product");
const imageKit = require("../services/imageKit");

// ➤ إنشاء منتج جديد (يدخل بحالة pending + رفع الصور)
exports.createProduct = async (req, res) => {
  try {
    const { title, price, discountedPrice, category, reviews,description , contactInfo } = req.body;
    const thumbnails = [];
    const previews = [];
    const fileIds = [];

    // رفع صور thumbnails
    if (req.files?.thumbnails) {
      for (const file of req.files.thumbnails) {
        const uploadResponse = await imageKit.upload({
          file: file.buffer.toString("base64"),
          fileName: `${Date.now()}-thumb.jpg`,
        });
        thumbnails.push(uploadResponse.url);
        fileIds.push(uploadResponse.fileId);
      }
    }

    // رفع صور previews
    if (req.files?.previews) {
      for (const file of req.files.previews) {
        const uploadResponse = await imageKit.upload({
          file: file.buffer.toString("base64"),
          fileName: `${Date.now()}-preview.jpg`,
        });
        previews.push(uploadResponse.url);
        fileIds.push(uploadResponse.fileId);
      }
    }

    // حفظ المنتج في قاعدة البيانات
    const product = await Product.create({
      title,
      price,
      discountedPrice,
      category,
      description,
      contactInfo,
      reviews,
      imgs: { thumbnails, previews },
      imageFileIds: fileIds,
      createdBy: req.user.userId, // من التوكن
      
      // createdByName: `${first_name} ${last_name}`,
      status: "pending",
    });
    if (!req.user || !req.user.userId) {
  return res.status(401).json({ ok: false, error: "Unauthorized: userId missing" });
}

    res.status(201).json({ ok: true, product });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

// ➤ جلب كل المنتجات (مثلاً للسوق العام)
// exports.getProducts = async (req, res) => {
//   try {
//     const products = await Product.find({ status: "approved" }).sort({
//       createdAt: -1,
//     });
//     res.json({ ok: true, products });
//   } catch (err) {
//     res.status(500).json({ ok: false, error: err.message });
//   }
// };

// ➤ جلب كل المنتجات (مثلاً للسوق العام)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .populate("createdBy", "first_name last_name email profileImage"); 
      // هنا نحدد الحقول اللي نريدها من جدول User

    res.json({ ok: true, products });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
// ➤ جلب المنتجات الخاصة بالمستخدم الحالي
// exports.getMyProducts = async (req, res) => {
//   try {
//     const products = await Product.find({ createdBy: req.user.userId })
//       .sort({ createdAt: -1 })
//       .populate("createdBy", "first_name last_name email");

//     res.json({ ok: true, products });
//   } catch (err) {
//     res.status(500).json({ ok: false, error: err.message });
//   }
// };

// ➤ جلب المنتجات الخاصة بالمستخدم الحالي في حالة pending أو rejected
exports.getMyOrders = async (req, res) => {
  try {
    const products = await Product.find({ 
        createdBy: req.user.userId,
        status: { $in: ["pending", "rejected"] }   // فلترة حسب الحالات المطلوبة
      })
      .sort({ createdAt: -1 })
      .populate("createdBy", "first_name last_name email");

    res.json({ ok: true, products });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ 
        createdBy: req.user.userId,
        status: { $in: ["approved"] }   // فلترة حسب الحالات المطلوبة
      })
      .sort({ createdAt: -1 })
      .populate("createdBy", "first_name last_name email profileImage");

    res.json({ ok: true, products });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
// ➤ جلب المنتجات المعلقة (Admin فقط)
exports.getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "pending" }).sort({
      createdAt: -1,
    })
    .populate("createdBy", "first_name last_name email");
    res.json({ ok: true, products });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

// ➤ قبول منتج (Admin)
exports.approveProduct = async (req, res) => {
  try {
    const { reviews } = req.body; // المراجعة القادمة من الـ frontend

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: "approved", rejectionReason: null, reviews: reviews || 0 },
      { new: true }
    );
    if (!product)
      return res.status(404).json({ ok: false, error: "Product not found" });

    res.json({ ok: true, product });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
  console.log("approveProduct called with reviews:", reviews);
};


exports.rejectProduct = async (req, res) => {
  try {
    const { reason } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ ok: false, error: "Product not found" });

    product.status = "rejected";
    product.rejectionReason = reason || "لم يتم قبول المنتج";
    product.rejectedAt = new Date(); // وقت الرفض

    await product.save();

    res.json({ ok: true, product });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
  console.log("rejectProduct called with reason:", reason);
};

// ➤ حذف منتج مباشرة (من MongoDB + الصور في ImageKit)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ ok: false, error: "Product not found" });

    // حذف الصور من ImageKit
  if (product.imageFileIds?.length > 0) {
      for (const fileId of product.imageFileIds) {
        await imageKit.deleteFile(fileId);
      }
    }

    // حذف المنتج من MongoDB
    await Product.findByIdAndDelete(req.params.id);

    res.json({ ok: true, message: "Product and images deleted" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};  
exports.searchProductsByName = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: "كلمة البحث مطلوبة" });

  try {
    const safeQ = String(q).slice(0, 100); // limit length
    const regex = new RegExp(
      safeQ.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    ); // escape regex chars

    const products = await Product.find({ title: regex }) // تأكد أن الحقل اسمه title أو name
      .select("title price discountedPrice imgs previews description contactInfo createdBy createdAt") // حدد الحقول اللي تريدها
      .populate("createdBy", "first_name last_name email profileImage") // جلب بيانات المستخدم اللي أنشأ المنتج
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return res.status(200).json(products);
  } catch (error) {
    console.error("searchProductsByName error:", error);
    return res
      .status(500)
      .json({ message: "خطأ أثناء البحث", error: error.message });
  }
};
