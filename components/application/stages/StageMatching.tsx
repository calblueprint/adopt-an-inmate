'use client';

import CustomLink from '@/components/CustomLink';
import { useApplicationContext } from '@/contexts/ApplicationContext';

export default function StageMatching() {
  const { appState } = useApplicationContext();

  return (
    <div className="flex flex-col pt-10">
      <CustomLink href={`/app/${appState.appId}?stage=main`}>
        Back to main application
      </CustomLink>
      <p>Matching View</p>
      <CustomLink href={`/app/${appState.appId}?stage=submitted`}>
        Submit application
      </CustomLink>
    </div>
  );
}
