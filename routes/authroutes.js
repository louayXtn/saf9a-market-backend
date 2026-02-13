const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyJWT = require("../middleware/verifyJWT");
router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/refresh").get(authController.refresh);
router.route("/logout").post(authController.logout);
// router.route("/updateProfile").post(verifyJWT, authController.updateProfile);
// router.route("/changePassword").post(verifyJWT, authController.changePassword);
// 🆕 مسار طلب إعادة تعيين كلمة المرور (Forgot Password)
router.route("/forgot-password").post(authController.forgotPassword);

// 🆕 مسار إعادة التعيين الفعلي (Reset Password)
router.route("/reset-password").post(authController.resetPassword);


module.exports = router;
