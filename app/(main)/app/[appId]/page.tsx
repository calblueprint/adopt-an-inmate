import Link from 'next/link';
import { notFound } from 'next/navigation';
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
  const { data: appData, error: getAppError } = await supabase
    .from('adopter_applications_dummy')
    .select()
    .eq('app_uuid', appId)
    .maybeSingle();

  if (getAppError || !appData) throw notFound();

  // Use stage from URL if present, otherwise compute from app data
  const urlStage = resolvedSearchParams?.stage;
  const defaultStage =
    urlStage !== undefined && urlStage !== ''
      ? parseInt(urlStage, 10)
      : (getResumeStageAndQuestion(appData).stage as ApplicationStage);

  const predefinedOffenses = ['Violent offense', 'Harm-related offense'];
  const offensePref = appData.offense_pref ?? [];
  const offensePreference = offensePref.filter(offense =>
    predefinedOffenses.includes(offense),
  );
  const customOffense = offensePref.find(
    offense => !predefinedOffenses.includes(offense),
  );

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
              offensePreference:
                offensePreference.length > 0
                  ? (offensePreference as FormState['offensePreference'])
                  : undefined,
              offenseOther:
                (customOffense as FormState['offenseOther']) ?? undefined,
              whyAdopting: appData.return_explanation ?? undefined,
              whyEnded: appData.return_explanation ?? undefined,
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
