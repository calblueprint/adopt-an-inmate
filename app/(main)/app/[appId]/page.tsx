import Link from 'next/link';
import DeciderStage from '@/components/application/DeciderStage';
import Logo from '@/components/Logo';
import { ApplicationContextProvider } from '@/contexts/ApplicationContext';

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  return (
    <div className="flex size-full flex-col items-center justify-center">
      <Link href="/">
        <Logo />
      </Link>

      <div className="flex size-full flex-col items-center justify-center">
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

      {/* spacer */}
      <div className="h-22" />
    </div>
  );
}
