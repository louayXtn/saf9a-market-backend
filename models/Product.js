
// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     price: { type: Number, },
//     discountedPrice: { type: Number },
//     reviews: { type: Number, default: 0 },
//     category: { type: String, required: true },
//     description: { type: String },
//     // ✅ بدل imageUrl واحد، نخزن مجموعة صور
//     imgs: {
//       thumbnails: {
//         type: [String], // روابط صور صغيرة من ImageKit
//         default: [],
//       },
//       previews: {
//         type: [String], // روابط صور كبيرة من ImageKit
//         default: [],
//       },
//     },

//     // ✅ نخزن الـ fileId لكل صورة من ImageKit (مهم للحذف)
//     imageFileIds: {
//       type: [String],
//       default: [],
//     },

//   },

//   { timestamps: true }
// );

// module.exports = mongoose.model("Product", productSchema)



const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number },
    discountedPrice: { type: Number },
    reviews: { type: Number, default: 0 },
    category: { type: String, required: true },
    description: { type: String },
    contactInfo: { type: String , required: true},

    imgs: {
      thumbnails: { type: [String], default: [] },
      previews: { type: [String], default: [] },
    },

    imageFileIds: { type: [String], default: [] }, // مهم للحذف من ImageKit

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    // Product Model
    rejectedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: null },

    createdBy: {
    type: require("mongoose").Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
  
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);