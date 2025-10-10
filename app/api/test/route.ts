import autoEmailSender from '@/actions/emails/email';

export async function GET() {
  if (typeof process.env.TESTING_EMAIL_ADDRESS === 'undefined') {
    throw new Error('Sender address is undefined');
  }

  if (typeof process.env.TESTING_EMAIL_APP_PASSWORD === 'undefined') {
    throw new Error('Sender app password is undefined');
  }

  if (typeof process.env.TESTING_EMAIL_RECIPIENT === 'undefined') {
    throw new Error('Recipient is undefined');
  }

  await autoEmailSender(
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

  return new Response('hello');
}
