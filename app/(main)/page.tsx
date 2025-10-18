import CustomLink from '@/components/CustomLink';

export default function ApplicationsPage() {
  return (
    <main className="flex h-full w-full flex-col items-center justify-center">
      <p>Applications page</p>
      <CustomLink href="/app/1234567890">Sample app</CustomLink>
      <CustomLink href="/sign-up">Sign up</CustomLink>
      <CustomLink href="/login">Login</CustomLink>
      <CustomLink href="/onboarding">Onboarding</CustomLink>
      <CustomLink href="/profile">Profile</CustomLink>
    </main>
  );
}
