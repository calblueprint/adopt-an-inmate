import CustomLink from '@/components/CustomLink';

export default function ApplicationsPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <CustomLink href="/">← Back to Home</CustomLink>
      <p className="text-center">Applications page</p>
      <CustomLink href="/applications/1234567890">
        View sample application
      </CustomLink>
    </div>
  );
}
