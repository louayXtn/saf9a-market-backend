const nodemailer = require("nodemailer");

// Brevo (Sendinblue) Configuration - مجاني 300 بريد/يوم
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_LOGIN,  // a285e9001@smtp-brevo.com
    pass: process.env.BREVO_API_KEY // 7IwZR62LFcHCnVPh
  },
  connectionTimeout: 10000,
  socketTimeout: 10000,
});

// اختبار الاتصال عند بدء التطبيق
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email service error:", error.message);
  } else {
    console.log("✅ Email service is ready (Brevo)");
  }
});

const sendResetEmail = async (toEmail, resetLink) => {
  try {
    if (!toEmail || !resetLink) {
      throw new Error("Missing email or resetLink");
    }

    console.log("📧 Sending reset email to:", toEmail);

    const mailOptions = {
      from: process.env.SENDER_EMAIL, // louayawadh5@gmail.com
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
    console.log("✅ Email sent successfully to:", toEmail);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error;
  }
};

module.exports = { sendResetEmail };