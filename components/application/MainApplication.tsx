'use client';

import { useApplicationContext } from '@/contexts/ApplicationContext';
import CustomLink from '../CustomLink';

export default function MainApplication() {
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
