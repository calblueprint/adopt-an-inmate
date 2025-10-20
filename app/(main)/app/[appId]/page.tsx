import DeciderStage from '@/components/application/DeciderStage';
import { ApplicationContextProvider } from '@/contexts/ApplicationContext';

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <ApplicationContextProvider
        defaultAppState={{
          appId,
          highestStageAchieved: 'pre',
          form: {},
          draft: {},
        }}
      >
        <DeciderStage />
      </ApplicationContextProvider>
    </div>
  );
}
