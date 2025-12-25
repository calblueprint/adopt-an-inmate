'use client';

import { useRouter } from 'next/navigation';
import Logger from '@/actions/logging';
import { upsertApplication } from '@/actions/queries/query';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useAuth } from '@/contexts/AuthProvider';
import { ApplicationStage } from '@/types/enums';
import { AdopterApplicationUpdate } from '@/types/schema';

/**
 * Hook that returns helper functions related to navigation
 * within the adopter application process.
 */
export const useApplicationNavigation = () => {
  const router = useRouter();
  const { appState, appStage } = useApplicationContext();

  const { userId } = useAuth();
  //const { appState } = useApplicationContext();

  /**
   * Helper function to record current stage in context
   * and update route
   */
  const advanceToStage = async (stage: ApplicationStage) => {
    appStage.current = stage;
    router.push(`?stage=${stage}&q=0`);
  };

  /**
   * Helper function to validate user id, app id,
   * and then upsert their application responses
   */
  const upsertAppInfo = async (app: AdopterApplicationUpdate) => {
    try {
      if (!userId) {
        Logger.error('Updating Application Info: missing userId');
        return;
      }
      await upsertApplication({
        adopter_uuid: userId,
        app_uuid: appState.appId,
        ...app,
      });
    } catch (error) {
      Logger.error(`Failed to save application: ${String(error)}`);
    }
  };

  return { advanceToStage, upsertAppInfo };
};
