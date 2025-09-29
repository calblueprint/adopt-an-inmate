import CustomLink from '@/components/CustomLink';

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <CustomLink href="/">← Go back</CustomLink>
      <div className="text-center">Viewing application {appId}</div>
    </div>
  );
}
