'use client';

import { useRouter } from 'next/navigation';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { ApplicationStage } from '@/types/enums';

/**
 * Hook that returns helper functions related to navigation
 * within the adopter application process.
 */
export const useApplicationNavigation = () => {
  const router = useRouter();
  const { appStage } = useApplicationContext();

  /**
   * Helper function to record current stage in context
   * and update route
   */
  const advanceToStage = (stage: ApplicationStage) => {
    appStage.current = stage;
    router.push(`?stage=${stage}&q=0`);
    // TODO: add database update
  };

  return { advanceToStage };
};
