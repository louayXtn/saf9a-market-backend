const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendResetEmail = async (toEmail, resetLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "إعادة تعيين كلمة المرور",
    html: `
      <h2>طلب إعادة تعيين كلمة المرور</h2>
      <p>اضغط على الرابط التالي لإعادة تعيين كلمة المرور:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>الرابط صالح لمدة ${process.env.RESET_TOKEN_TTL_MINUTES} دقيقة.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };