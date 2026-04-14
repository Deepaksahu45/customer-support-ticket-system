// Aegis — Email utility (placeholder for dev, uses nodemailer)
const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  // In development, just log the email
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your@gmail.com') {
    console.log('📧 Aegis Email (dev mode):');
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Body: ${html.substring(0, 100)}...`);
    return { messageId: 'dev-mode' };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Aegis Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log(`📧 Aegis Email sent: ${info.messageId}`);
  return info;
};

module.exports = sendEmail;
