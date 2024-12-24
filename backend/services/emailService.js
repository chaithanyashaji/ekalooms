import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use a mail service of your choice (e.g., Gmail, Outlook, etc.)
  auth: {
    user: process.env.EMAIL, // Your email
    pass: process.env.EMAIL_PASSWORD // App password or email password
  }
});

export const sendMail = async (to, subject,content, isHTML = false) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    content,
    text: !isHTML ? content : undefined, // Plain text fallback
    html: isHTML ? content : undefined, 
  };

  try {
    await transporter.sendMail(mailOptions);
    
  } catch (error) {
    console.log('Error sending email:', error.message);
    throw new Error('Email sending failed');
  }
};
