import nodemailer from 'nodemailer';

const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    // Gmail settings (Service එක වෙනස් නම් host/port වෙනස් කරන්න)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // .env එකෙන් ගන්නවා
        pass: process.env.EMAIL_PASS, // .env එකෙන් ගන්නවා (App Password)
      },
    });

    await transporter.sendMail({
      from: `"LibFlow Library" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;