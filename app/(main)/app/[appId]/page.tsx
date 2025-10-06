import StageDecider from '@/components/application/StageDecider';
import CustomLink from '@/components/CustomLink';
import { ApplicationContextProvider } from '@/contexts/ApplicationContext';

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <CustomLink href="/app">← All applications</CustomLink>
      <p>Viewing application {appId}</p>
      <ApplicationContextProvider
        defaultAppState={{ appId, highestStageAchieved: 'pre' }}
      >
        <StageDecider />
      </ApplicationContextProvider>
    </div>
  );
}
