const cron = require("node-cron");
const Product = require("../models/Product"); // تأكد من المسار الصحيح
const imageKit = require("../services/imageKit"); // تأكد من المسار الصحيح

// مهمة كل ساعة
cron.schedule("0 * * * *", async () => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // قبل 24 ساعة

//   for test 
//   const cutoff = new Date(Date.now() - 1 * 60 * 1000); // قبل دقيقة واحدة
  const products = await Product.find({
    status: "rejected",
    rejectedAt: { $lte: cutoff }
  });

  for (const product of products) {
    // حذف الصور من ImageKit
    for (const fileId of product.imageFileIds) {
      try {
        await imageKit.deleteFile(fileId);
      } catch (err) {
        console.error("خطأ في حذف صورة:", err.message);
      }
    }
    // حذف المنتج من قاعدة البيانات
    await Product.findByIdAndDelete(product._id);
    console.log(`تم حذف المنتج ${product._id} بعد 24 ساعة من رفضه`);
  }
});