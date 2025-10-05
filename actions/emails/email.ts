import * as dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config({ path: '.env.local' });

export async function autoEmailSender(
  senderAddress: string | undefined,
  senderAppPassword: string | undefined,
  senderName: string,
  text: string,
  subject: string,
  recipient: string | undefined,
) {
  if (typeof senderAddress === 'undefined') {
    throw new Error('Sender address is undefined');
  }

  if (typeof senderAppPassword === 'undefined') {
    throw new Error('Sender app password is undefined');
  }

  if (typeof recipient === 'undefined') {
    throw new Error('Recipient is undefined');
  }

  const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: senderAddress,
      pass: senderAppPassword,
    },
  });

  const info = await transporter.sendMail({
    from: `${senderName} <${senderAddress}>`,
    to: recipient,
    subject: subject,
    text: text,
  });

  console.log('Message sent:', info.messageId);
}

// Testing Function: Change the inputs as needed to test
// NOTE: The password is the app password, not the normal password (will need to set it up in your 2FA settings)

autoEmailSender(
  process.env.TESTING_EMAIL_ADDRESS,
  process.env.TESTING_EMAIL_APP_PASSWORD,
  'NAME',
  'TEXT',
  'SUBJECT',
  process.env.TESTING_EMAIL_RECIPIENT,
).catch(err => {
  console.error('Error sending email:', err);
  process.exit(1);
});

export default autoEmailSender;
