const axios = require("axios");

// Brevo API Configuration - مجاني 300 بريد/يوم
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const sendResetEmail = async (toEmail, resetLink) => {
  try {
    if (!toEmail || !resetLink) {
      throw new Error("Missing email or resetLink");
    }

    if (!BREVO_API_KEY) {
      console.error("❌ BREVO_API_KEY is not set");
      throw new Error("Email service not configured");
    }

    console.log("📧 Sending reset email to:", toEmail);

    const emailData = {
      to: [
        {
          email: toEmail,
          name: toEmail
        }
      ],
      sender: {
        email: process.env.SENDER_EMAIL,
        name: "Market Support"
      },
      subject: "Password Reset Request",
      htmlContent: `
        <h2>Password Reset Request</h2>
        <p>Click the following link to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>Direct link: ${resetLink}</p>
        <p>This link is valid for ${process.env.RESET_TOKEN_TTL_MINUTES || 15} minutes.</p>
        <p><strong>Note:</strong> If you did not request a password reset, please ignore this email.</p>
      `
    };

    const response = await axios.post(BREVO_API_URL, emailData, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json"
      },
      timeout: 10000
    });

    console.log("✅ Email sent successfully to:", toEmail);
    console.log("📨 Message ID:", response.data.messageId);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    if (error.response) {
      console.error("❌ Brevo API Error:", error.response.data);
    }
    throw error;
  }
};

module.exports = { sendResetEmail };