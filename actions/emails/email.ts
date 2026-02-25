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
    host: 'smtp-relay.brevo.com', //switched to brevo and port to 587 with secure as false
    port: 587,
    secure: false,
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
