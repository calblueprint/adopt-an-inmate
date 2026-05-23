'use client';

import { useRouter } from 'next/navigation';
import Logger from '@/actions/logging';
import exportApplication from '@/actions/monday/mutations/exportApplication';
import { upsertApplication } from '@/actions/queries/query';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useAuth } from '@/contexts/AuthProvider';
import { ApplicationStage } from '@/types/enums';
import { AdopterApplicationUpdate } from '@/types/schema';

/**
 * Hook that returns helper functions related to
 * the adopter application process.
 */
export const useAppProcess = () => {
  const router = useRouter();
  const { appState, appStage } = useApplicationContext();
  const { userId } = useAuth();

  /**
   * Helper function to record current stage in context
   * and update route
   */
  const advanceToStage = async (stage: ApplicationStage) => {
    appStage.current = stage;
    router.push(`?stage=${stage}&q=0`);
  };

  /**
   * Helper function to validate user id and app state
   * before upserting main app response
   */
  const upsertAppInfo = async (app: AdopterApplicationUpdate) => {
    try {
      if (!userId) {
        Logger.error('Error updating application info: missing userId');
        return;
      }

      // ignore upserts if matches are set
      if (appState.matches) return;

      await upsertApplication({
        adopter_uuid: userId,
        app_uuid: appState.appId,
        ...app,
      });
    } catch (error) {
      Logger.error(`Failed to save application: ${String(error)}`);
    }
  };

  /**
   * Uses logged in user ID and application in context.
   * Takes a ranked order of adoptee IDs and submits the application.
   */
  const submitApp = async (ranks: string[]) => {
    try {
      if (!userId) {
        Logger.error('Error updating application info: missing userId');
        return;
      }

      // save the application on supabase
      await upsertApplication({
        adopter_uuid: userId,
        app_uuid: appState.appId,
        status: 'PENDING',
        ranked_cards: ranks,
        time_submitted: new Date().toISOString(),
      });
    } catch (error) {
      Logger.error(`Failed to save application: ${String(error)}`);
    }

    // export the application to monday
    const { success, error } = await exportApplication(appState.appId);

    if (!success || error) {
      Logger.error(`Application export failed: ${String(error)}`);
      throw new Error(String(error));
    }
  };

  return { advanceToStage, upsertAppInfo, submitApp };
};
