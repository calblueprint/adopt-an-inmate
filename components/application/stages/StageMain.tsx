'use client';

import CustomLink from '@/components/CustomLink';
import { useApplicationContext } from '@/contexts/ApplicationContext';

export default function StageMain() {
  const { appState } = useApplicationContext();

  return (
    <div className="flex flex-col pt-10">
      <CustomLink href={`/app/${appState.appId}`}>
        Back to pre application
      </CustomLink>
      <p>Main Application</p>
      <CustomLink href={`/app/${appState.appId}?stage=matches`}>
        View matches
      </CustomLink>
    </div>
  );
}
