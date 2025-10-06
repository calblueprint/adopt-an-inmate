import autoEmailSender from "@/actions/emails/email";

export async function GET() {
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

  return new Response("hello")
}