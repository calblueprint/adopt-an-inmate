import CustomLink from '@/components/CustomLink';

export default function ProfilePage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <CustomLink href="/">← Go back</CustomLink>
      <p>Profile page</p>
    </div>
  );
}
