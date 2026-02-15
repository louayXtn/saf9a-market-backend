const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { sendResetEmail } = require("../utils/mailer"); // بدون .js
const crypto = require("crypto");

// unified cookie options (secure/sameSite only for production)
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

const register = async (req, res) => {
  const { first_name, last_name, email, password,address ,contact} = req.body;
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const foundUser = await User.findOne({ email });
  if (foundUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hashSync(password, 10);
  const user = await new User({
    first_name,
    last_name,
    email,
    password: hashedPassword,
    address,
    contact
  }).save();
  const accessToken = jwt.sign(
    { userInfo: { userId: user._id, isAdmin: user.isAdmin } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
  const refreshToken = jwt.sign(
    { userInfo: { userId: user._id, isAdmin: user.isAdmin } },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  res.cookie('jwt', refreshToken, cookieOptions);
   res.cookie("access_token", accessToken, {
  httpOnly: false, // يخلي الـ frontend يقدر يقرأه
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 60 * 60 * 1000, // ساعة واحدة
});
  res.json({
    accessToken,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    address: user.address,
    contact: user.contact,
    profileImage: user.profileImage
  });
 
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const foundUser = await User.findOne({ email });
  if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const accessToken = jwt.sign(
    { userInfo: { userId: foundUser._id, isAdmin: foundUser.isAdmin } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
  const refreshToken = jwt.sign(
    { userInfo: { userId: foundUser._id, isAdmin: foundUser.isAdmin } },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  res.cookie('jwt', refreshToken, cookieOptions);
  res.cookie("access_token", accessToken, {
  httpOnly: false, // يخلي الـ frontend يقدر يقرأه
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 60 * 60 * 1000, // ساعة واحدة
});
  res.json({
    accessToken,
    email: foundUser.email,
    first_name: foundUser.first_name,
    last_name: foundUser.last_name,
    address: foundUser.address,
    contact: foundUser.contact,
    profileImage: foundUser.profileImage
  });
};
const refresh = (req, res) => {
  const cookies = req.cookies;
  console.log("refresh called, cookies:", cookies); // debug: verify cookie present server-side
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      const foundUser = await User.findOne({ _id: decoded.userInfo.userId });
      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });
      const accessToken = jwt.sign(
        {
          userInfo: {
            userId: foundUser._id,
            isAdmin: foundUser.isAdmin,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      res.cookie("access_token", accessToken, {
        httpOnly: false, // يخلي الـ frontend يقدر يقرأه
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 60 * 60 * 1000, // ساعة واحدة
      });

      res.json({
        accessToken,
        email: foundUser.email,
        first_name: foundUser.first_name,
        last_name: foundUser.last_name,
        address: foundUser.address,
        contact: foundUser.contact,
        profileImage: foundUser.profileImage
      });
    }
  );
};
/* const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { sendResetEmail } = require("../utils/mailer"); // بدون .js
const crypto = require("crypto");

// unified cookie options (secure/sameSite only for production)
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

const register = async (req, res) => {
  const { first_name, last_name, email, password,address ,contact} = req.body;
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const foundUser = await User.findOne({ email });
  if (foundUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hashSync(password, 10);
  const user = await new User({
    first_name,
    last_name,
    email,
    password: hashedPassword,
    address,
    contact
  }).save();
  const accessToken = jwt.sign(
    { userInfo: { userId: user._id, isAdmin: user.isAdmin } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
  const refreshToken = jwt.sign(
    { userInfo: { userId: user._id, isAdmin: user.isAdmin } },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  res.cookie('jwt', refreshToken, cookieOptions);
   res.cookie("access_token", accessToken, {
  httpOnly: false, // يخلي الـ frontend يقدر يقرأه
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 60 * 60 * 1000, // ساعة واحدة
});
  res.json({
    accessToken,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    address: user.address,
    contact: user.contact,
    profileImage: user.profileImage
  });
 
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const foundUser = await User.findOne({ email });
  if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const accessToken = jwt.sign(
    { userInfo: { userId: foundUser._id, isAdmin: foundUser.isAdmin } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
  const refreshToken = jwt.sign(
    { userInfo: { userId: foundUser._id, isAdmin: foundUser.isAdmin } },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  res.cookie('jwt', refreshToken, cookieOptions);
  res.cookie("access_token", accessToken, {
  httpOnly: false, // يخلي الـ frontend يقدر يقرأه
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 60 * 60 * 1000, // ساعة واحدة
});
  res.json({
    accessToken,
    email: foundUser.email,
    first_name: foundUser.first_name,
    last_name: foundUser.last_name,
    address: foundUser.address,
    contact: foundUser.contact,
    profileImage: foundUser.profileImage
  });
};
const refresh = (req, res) => {
  const cookies = req.cookies;
  console.log("refresh called, cookies:", cookies); // debug: verify cookie present server-side
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      const foundUser = await User.findOne({ _id: decoded.userInfo.userId });
      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });
      const accessToken = jwt.sign(
        {
          userInfo: {
            userId: foundUser._id,
            isAdmin: foundUser.isAdmin,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      res.cookie("access_token", accessToken, {
        httpOnly: false, // يخلي الـ frontend يقدر يقرأه
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 60 * 60 * 1000, // ساعة واحدة
      });

      res.json({
        accessToken,
        email: foundUser.email,
        first_name: foundUser.first_name,
        last_name: foundUser.last_name,
        address: foundUser.address,
        contact: foundUser.contact,
        profileImage: foundUser.profileImage
      });
    }
  );
};
 */




const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { ...cookieOptions, maxAge: 0 });
  res.json({ message: "Cookie cleared" });
};


// update porfile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // جاي من الـ JWT middleware
    const { first_name, last_name, address, contact } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    // حدّث الحقول المطلوبة فقط
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (address) user.address = address;
    if (contact) user.contact = contact;

    await user.save();

    // رجّع فقط الحقول اللي تهمك
    res.json({
      message: "تم تحديث البيانات بنجاح",
      first_name: user.first_name,
      last_name: user.last_name,
      address: user.address,
      contact: user.contact,
      profileImage: user.profileImage,
      email: user.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ في السيرفر" });
  }
};
// controllers/userController.js

// const updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.userId; // جاي من الـ JWT middleware
//     const { first_name, last_name, address, contact } = req.body;

//     // ابحث عن المستخدم
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "المستخدم غير موجود" });
//     }

//     // حدّث الحقول لو موجودة
//     if (first_name) user.first_name = first_name;
//     if (last_name) user.last_name = last_name;
//     if (address) user.address = address;
//     if (contact) user.contact = contact;

//     // احفظ التغييرات
//     await user.save();

//     // رجّع الـ user كامل بدون الباسوورد
//     const updatedUser = await User.findById(userId).select("-password");

//     res.json({
//       message: "تم تحديث البيانات بنجاح",
//       user: updatedUser
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "خطأ في السيرفر" });
//   }
// };



// update password

const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId; // من التوكن
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "كلمة المرور القديمة غير صحيحة" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "تم تغيير كلمة المرور بنجاح" });
  } catch (err) {
    res.status(500).json({ message: "خطأ في السيرفر" });
  }
};


// update profile image
// const updateProfileImage = async (req, res) => {
//   try {
//     const userId = req.user.userId; // جاي من الـ JWT middleware
//     const { imageName } = req.body; // اسم الصورة المختارة من المودل

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

//     user.profileImage = imageName; // تحديث الصورة
//     await user.save();

//     res.json({
//       message: "تم تحديث صورة البروفايل بنجاح",
//       profileImage: user.profileImage,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "خطأ في السيرفر" });
//   }
// };


const updateProfileImage = async (req, res) => {
  try {
    const userId = req.user.userId; // جاي من الـ JWT middleware
    const { imageName } = req.body; // اسم الصورة المختارة من المودل

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    // تحديث الصورة
    user.profileImage = imageName;
    await user.save();

    // رجّع فقط الحقول المهمة زي ما عملت في updateProfile
    res.json({
      message: "تم تحديث صورة البروفايل بنجاح",
      first_name: user.first_name,
      last_name: user.last_name,
      address: user.address,
      contact: user.contact,
      profileImage: user.profileImage,
      email: user.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ في السيرفر" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "If the email is correct, you will receive a message" });

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.resetToken = hashedToken;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();

  const resetLink = `${process.env.APP_URL}/reset-password?token=${rawToken}`;
  await sendResetEmail(email, resetLink);

  res.json({ message: "A reset link has been sent to your email address" });
};
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "New code and password required"});
    }

    // نحول الرمز الخام إلى نسخة مشفّرة ونبحث عنها في قاعدة البيانات
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() } // صالح ولم ينتهِ
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired code"});
    }

    // تحديث كلمة المرور
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password successfully updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  updateProfile,
  changePassword,
  updateProfileImage,
  forgotPassword,
  resetPassword
};