const nodemailer = require("nodemailer");

// Ethereal Email Configuration (مجاني 100%)
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 10000,
  socketTimeout: 10000,
});

// اختبار الاتصال عند بدء التطبيق
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email service error:", error.message);
  } else {
    console.log("✅ Email service is ready (Ethereal)");
  }
});

const sendResetEmail = async (toEmail, resetLink) => {
  try {
    if (!toEmail || !resetLink) {
      throw new Error("Missing email or resetLink");
    }

    console.log("📧 Sending reset email to:", toEmail);

    const mailOptions = {
      from: process.env.SENDER_EMAIL || process.env.EMAIL_USER,
      to: toEmail,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the following link to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link is valid for ${process.env.RESET_TOKEN_TTL_MINUTES || 15} minutes.</p>
        <p><strong>Note:</strong> If you did not request a password reset, please ignore this email.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
    console.log("📨 Preview URL:", nodemailer.getTestMessageUrl(info));
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error;
  }
};

module.exports = { sendResetEmail };