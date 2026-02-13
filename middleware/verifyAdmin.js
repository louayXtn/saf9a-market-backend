// verify admin middleware
const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    const isAdmin = decoded.userInfo?.isAdmin;
    if (!isAdmin) return res.status(403).json({ message: "Access denied" });

    req.user = decoded.userInfo;
    next();
  });
};

module.exports = verifyAdmin;


// const User = require("../models/user"); // مثال: استدعاء الموديل
// const jwt = require("jsonwebtoken");
// const verifyAdmin = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

//   const token = authHeader.split(" ")[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
//     if (err) return res.status(403).json({ message: "Forbidden" });

//     try {
//       // تحقق من وجود المستخدم في قاعدة البيانات
//       const user = await User.findById(decoded.userInfo.id);
//       if (!user) return res.status(404).json({ message: "User not found" });

//       // تحقق من صلاحية الأدمن
//       if (!user.isAdmin) return res.status(403).json({ message: "Access denied" });

//       req.user = user;
//       next();
//     } catch (error) {
//       return res.status(500).json({ message: "Server error" });
//     }
//   });
// };
// module.exports = verifyAdmin;