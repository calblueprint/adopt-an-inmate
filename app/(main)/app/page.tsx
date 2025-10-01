import CustomLink from '@/components/CustomLink';

export default function ApplicationsPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <CustomLink href="/">← Go back</CustomLink>
      <p>Applications page</p>
      <CustomLink href="/app/1234567890">Sample app</CustomLink>
    </div>
  );
}
