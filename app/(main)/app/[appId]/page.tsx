import Link from 'next/link';
import { notFound } from 'next/navigation';
import Logger from '@/actions/logging';
import DeciderStage from '@/components/application/DeciderStage';
import Logo from '@/components/Logo';
import { ApplicationContextProvider } from '@/contexts/ApplicationContext';
import { getSupabaseServerClient } from '@/lib/supabase';
import { getResumeStageAndQuestion } from '@/lib/utils';
import { ApplicationStage } from '@/types/enums';
import { FormState } from '@/types/types';

export default async function ApplicationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ appId: string }>;
  searchParams: Promise<{ stage?: string; q?: string }>;
}) {
  const { appId } = await params;
  const resolvedSearchParams = await searchParams;

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (!user || getUserError) {
    notFound();
  }

  const { data: appData, error: getAppError } = await supabase
    .from('adopter_applications_dummy')
    .select()
    .eq('app_uuid', appId)
    .eq('adopter_uuid', user.id)
    .maybeSingle();

  if (getAppError) {
    Logger.error(
      `User ${user.id} attempted to access application ${appId} but an error occurred: ${getAppError.message}`,
    );
    notFound();
  }

  if (!appData) {
    Logger.error(
      `User ${user.id} attempted to access application ${appId}, but no such application was found`,
    );
    notFound();
  }

  const resume = getResumeStageAndQuestion(appData);
  const urlStageRaw = resolvedSearchParams?.stage;
  const parsedStage =
    urlStageRaw !== undefined && urlStageRaw !== ''
      ? parseInt(urlStageRaw, 10)
      : NaN;
  const defaultStage = Number.isNaN(parsedStage)
    ? (resume.stage as ApplicationStage)
    : (parsedStage as ApplicationStage);

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-between">
      <Link href="/">
        <Logo />
      </Link>

      <div className="flex size-full flex-col items-center justify-center">
        {/* TODO: fetch app state from db and pass to context */}
        <ApplicationContextProvider
          defaultAppState={{
            appId,
            form: {
              bio: appData.personal_bio ?? undefined,
              genderPreference:
                (appData.gender_pref as FormState['genderPreference']) ??
                undefined,
            },
            matches: null,
            selectedMatch: null,
            stillInCorrespondence: false,
            rankedMatches: null,
          }}
          defaultStage={defaultStage}
        >
          <DeciderStage />
        </ApplicationContextProvider>
      </div>

      {/* spacer */}
      <div className="h-16" />
    </div>
  );
}
