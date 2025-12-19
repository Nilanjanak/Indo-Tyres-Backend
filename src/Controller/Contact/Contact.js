import nodemailer from 'nodemailer';

export const sendContactEmailGneral = async (req, res) => {
  const { name, email, message ,phone} = req.body;

  if (!name || !email || !message || !phone) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: ` <${email}>`,
      to: `${process.env.SMTP_USER}`,
      subject: 'Customer General Inquiry',
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
        <p><strong>Phone:</strong><br/>${phone}</p>

      `,
    });

    return res.status(200).json({ success: true, message: 'Email sent successfully.' });
  } catch (err) {
    console.error('❌ Email sending error:', err);
    return res.status(500).json({ success: false, error: 'Failed to send email.' });
  }
};