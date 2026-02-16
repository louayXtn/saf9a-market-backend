// const allowedOrigins = require("./allowedorigins");

// const corsoptions = {
//   origin: (origin, callback) => {
//     // origin can be undefined for same-origin / tools like Postman — allow if undefined
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, origin || true); // echo origin so Access-Control-Allow-Origin === origin
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   optionsSuccessStatus: 200,
// };

// module.exports = corsoptions;


const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: function (origin, callback) {
    
    // إذا الـ origin غير موجود (مثلاً Postman أو نفس الـ domain) → السماح
    if (!origin || allowedOrigins.includes(origin)) {

      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // ضروري لإرسال الكوكيز مع الطلبات
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;