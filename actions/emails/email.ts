import nodemailer from 'nodemailer';

export async function autoEmailSender(
  senderAddress: string,
  senderAppPassword: string,
  senderName: string,
  text: string,
  subject: string,
  recipient: string,
) {
  const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: senderAddress,
      pass: senderAppPassword,
    },
  });

  await transporter.sendMail({
    from: `${senderName} <${senderAddress}>`,
    to: recipient,
    subject: subject,
    text: text,
  });
}

export default autoEmailSender;
