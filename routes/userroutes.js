const express = require("express");
const router = express.Router();
const userscontroller = require("../controllers/userscontroller");
const authController = require("../controllers/authController");
const verifyJWT = require("../middleware/verifyJWT");
const User = require("../models/user");
const Product = require("../models/Product");
router.route("/").get(verifyJWT,userscontroller.getAllUsers);

// GET /api/users/:userId/profile
// router.get("/:userId/profile", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId).select("createdBy ,first_name last_name email country profileImage");
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const products = await Product.find({ createdBy: req.params.userId });
//     res.json({ user, products });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });
router.get("/:userId/profile", async (req, res) => {
  try {
    // بيانات المستخدم نفسه
    const user = await User.findById(req.params.userId)
      .select("first_name last_name email  address contact profileImage");

    if (!user) return res.status(404).json({ error: "User not found" });

    // المنتجات مع بيانات البائع
    const products = await Product.find({ 
    createdBy: req.params.userId, 
    status: "approved"   // فلترة المنتجات المعتمدة فقط
  })
  .populate("createdBy", "first_name last_name email contact address profileImage")
  .sort({ createdAt: -1 }); // ترتيب من الأحدث إلى الأقدم (اختياري)

    res.json({ user, products });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
  router.route("/update-profile").put( verifyJWT, authController.updateProfile);
  router.route("/change-password").put( verifyJWT, authController.changePassword);
  router.route("/update-profile-image").put( verifyJWT, authController.updateProfileImage);
module.exports = router;
