// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const upload = multer(); // لحفظ الملف في الذاكرة

// const { addProduct, deleteProduct, getProducts } = require("../controllers/productsController");

// // إضافة منتج مع صورة
// router.post("/add", upload.single("image"), addProduct);

// // حذف منتج
// router.delete("/:id", deleteProduct);
// router.get("/", getProducts);

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const upload = multer(); // لحفظ الملفات في الذاكرة

// const { addProduct, deleteProduct, getProducts } = require("../controllers/productsController");

// // إضافة منتج مع صور متعددة (thumbnails + previews)
// router.post(
//   "/add",
//   upload.fields([
//     { name: "thumbnails", maxCount: 5 },
//     { name: "previews", maxCount: 5 }
//   ]),
//   addProduct
// );

// // حذف منتج
// router.delete("/:id", deleteProduct);

// // عرض كل المنتجات
// router.get("/", getProducts);

// module.exports = router;


const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const verifyJWT = require("../middleware/verifyJWT");
const verifyAdmin = require("../middleware/verifyAdmin");
const {
  createProduct,
  getMyOrders,
  getMyProducts,
  getProducts,
  getPendingProducts,
  approveProduct,
  rejectProduct,
  deleteProduct,
  searchProductsByName,
} = require("../controllers/productsController");

// ➤ إضافة منتج مع صور
router.post(
  "/add",verifyJWT,
  
  upload.fields([
    { name: "thumbnails", maxCount: 2 },
    { name: "previews", maxCount: 2 },
  ]),
  createProduct
);

// ➤ جلب المنتجات المقبولة
router.get("/", getProducts);

// ➤ جلب المنتجات المعلقة
router.get("/pending", verifyAdmin, getPendingProducts);

// ➤ قبول منتج
router.patch("/:id/approve" , verifyAdmin, approveProduct);

// ➤ رفض منتج
router.patch("/:id/reject" , verifyAdmin, rejectProduct);

// ➤ حذف منتج (مع الصور)
router.delete("/:id", deleteProduct);
router.get("/myOrders", verifyJWT, getMyOrders);
router.get("/search", searchProductsByName);
router.get("/myProducts", verifyJWT, getMyProducts);
module.exports = router;