const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      default: "tunis",
    },
    contact: {
      type: String,
      default: "null",
    },
    profileImage: {
    type: String,
    default: "image0.png" // الصورة الافتراضية عند إنشاء الحساب
  },
   // 🔑 الحقول الجديدة الخاصة بإعادة تعيين كلمة المرور
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Date,
    },


  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
