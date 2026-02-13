// controllers/orderController.js
const Order = require("../models/order");

// إنشاء طلب جديد
exports.createOrder = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body); // اطبع البيانات اللي جاية من الفرونت
    const { items, customerInfo } = req.body;

    const order = new Order({ items, customerInfo });
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error); // اطبع الخطأ في السيرفر
    res.status(500).json({ error: "خطأ أثناء إنشاء الطلب", details: error.message });
  }
};
// // جلب الطلبات الخاصة ببائع معين
// exports.getSellerOrders = async (req, res) => {
//   try {
    
//     const sellerId = req.user.userId // لازم يكون عندك Middleware يضيف user للـ req

//     const orders = await Order.find({ "items.sellerId": sellerId });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ error: "خطأ أثناء جلب الطلبات" });
//   }
// };
exports.getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.userId;

    const orders = await Order.find({ "items.sellerId": sellerId });

    // فلترة المنتجات داخل كل Order
    const filteredOrders = orders.map(order => {
      return {
        ...order._doc,
        items: order.items.filter(
          item => item.sellerId.toString() === sellerId.toString()
        )
      };
    });

    res.json(filteredOrders);
  } catch (error) {
    res.status(500).json({ error: "خطأ أثناء جلب الطلبات" });
  }
};

// حذف طلب
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "الطلب غير موجود" });
    }

    // تحقق أن البائع هو صاحب المنتجات داخل الطلب
    const isOwner = order.items.some(item => item.sellerId == req.user.userId);

    if (!isOwner) {
      return res.status(403).json({ error: "غير مسموح بالحذف" });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "خطأ أثناء حذف الطلب" });
  }
};