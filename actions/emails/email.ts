import nodemailer from 'nodemailer';


if (typeof process.env.TESTING_EMAIL_ADDRESS === 'undefined') {
    throw new Error('Sender address is undefined');
  }

  if (typeof process.env.TESTING_EMAIL_APP_PASSWORD === 'undefined') {
    throw new Error('Sender app password is undefined');
  }

  if (typeof process.env.TESTING_EMAIL_RECIPIENT === 'undefined') {
    throw new Error('Recipient is undefined');
  }


export async function autoEmailSender(
  senderAddress: string | undefined,
  senderAppPassword: string | undefined,
  senderName: string,
  text: string,
  subject: string,
  recipient: string | undefined,
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
