export default function ForgotPasswordCheckEmail() {
  return (
    <div className="flex w-106 flex-col gap-2 rounded-2xl bg-gray-1 p-8">
      <p className="text-3xl font-medium">Check your email.</p>

      <p className="text-gray-11">
        If the email you entered exists, you will receive a link to proceed with
        resetting your password. You may now close this tab.
      </p>
    </div>
  );
}
