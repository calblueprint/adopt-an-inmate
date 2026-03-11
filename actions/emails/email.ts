import nodemailer from 'nodemailer';

export async function autoEmailSender(
  text: string,
  subject: string,
  recipient: string,
) {
  const senderAddress = process.env.BREVO_SMTP_USER;
  const senderAppPassword = process.env.BREVO_SMTP_KEY;
  const senderName = process.env.EMAIL_SENDER_NAME ?? 'Adopt an Inmate Team';
  const verifiedAddress = 'adopt@adoptaninmate.org';

  if (!senderAddress || !senderAppPassword) {
    throw new Error(
      'Missing email configuration: BREVO_SMTP_USER and BREVO_SMTP_KEY must be set in environment variables.',
    );
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: senderAddress,
      pass: senderAppPassword,
    },
  });

  await transporter.sendMail({
    from: `${senderName} <${verifiedAddress}>`,
    to: recipient,
    subject,
    text,
  });
}

export default autoEmailSender;
