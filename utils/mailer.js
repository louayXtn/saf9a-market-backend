const nodemailer = require("nodemailer");

// التحقق من المتغيرات المطلوبة
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ EMAIL_USER or EMAIL_PASS is not set");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// اختبار الاتصال عند بدء التطبيق
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email configuration error:", error.message);
  } else {
    console.log("✅ Email service is ready to send messages");
  }
});

const sendResetEmail = async (toEmail, resetLink) => {
  try {
    // التحقق من البيانات
    if (!toEmail || !resetLink) {
      throw new Error("Missing email or resetLink");
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "إعادة تعيين كلمة المرور",
      html: `
        <h2>طلب إعادة تعيين كلمة المرور</h2>
        <p>اضغط على الرابط التالي لإعادة تعيين كلمة المرور:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>الرابط صالح لمدة ${process.env.RESET_TOKEN_TTL_MINUTES || 15} دقيقة.</p>
        <p><strong>ملاحظة:</strong> إذا لم تطلب إعادة تعيين كلمة المرور، تجاهل هذا البريد.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    console.error("Full error:", error);
    throw error;
  }
};

module.exports = { sendResetEmail };