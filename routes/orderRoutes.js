// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const verifyJWT = require("../middleware/verifyJWT");
// POST /api/orders → إنشاء طلب
router.post("/orders",verifyJWT, orderController.createOrder );

// GET /api/orders/seller → جلب طلبات البائع
router.get("/orders/seller",verifyJWT, orderController.getSellerOrders, );

// DELETE /api/orders/:id → حذف طلب
router.delete("/orders/:id",verifyJWT, orderController.deleteOrder, );

module.exports = router;