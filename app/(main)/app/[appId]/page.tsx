import Link from 'next/link';
import { notFound } from 'next/navigation';
import DeciderStage from '@/components/application/DeciderStage';
import Logo from '@/components/Logo';
import { ApplicationContextProvider } from '@/contexts/ApplicationContext';
import { getSupabaseServerClient } from '@/lib/supabase';
import { ApplicationStage } from '@/types/enums';
import { FormState } from '@/types/types';

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  const supabase = await getSupabaseServerClient();
  const { data: appData, error: getAppError } = await supabase
    .from('adopter_applications_dummy')
    .select()
    .eq('app_uuid', appId)
    .maybeSingle();

  if (getAppError || !appData) throw notFound();

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
                (appData.offense_pref as FormState['offensePreference']) ??
                undefined,
              whyAdopting: appData.return_explanation ?? undefined,
              whyEnded: appData.return_explanation ?? undefined,
            },
            matches: null,
            selectedMatch: null,
            stillInCorrespondence: false,
            rankedMatches: null,
          }}
          defaultStage={ApplicationStage.PRE}
        >
          <DeciderStage />
        </ApplicationContextProvider>
      </div>

      {/* spacer */}
      <div className="h-16" />
    </div>
  );
}
