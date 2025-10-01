'use client';

import { useApplicationContext } from '@/contexts/ApplicationContext';
import CustomLink from '../CustomLink';

export default function MatchingView() {
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
