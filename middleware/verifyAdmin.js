/* 
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
 */


const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  let token;

  // جرّب أولاً من الـ Authorization header
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // إذا مافيش header، جرّب من الكوكي مباشرة
  if (!token && req.cookies?.access_token) {
    token = req.cookies.access_token;
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    const isAdmin = decoded.userInfo?.isAdmin;
    if (!isAdmin) return res.status(403).json({ message: "Access denied" });

    req.user = decoded.userInfo;
    next();
  });
};

module.exports = verifyAdmin;