'use client';

import { useApplicationContext } from '@/contexts/ApplicationContext';
import CustomLink from '../CustomLink';

export default function PreApplication() {
  const { appState } = useApplicationContext();

  return (
    <div className="flex flex-col pt-10">
      <p>Pre Application</p>
      <CustomLink href={`/app/${appState.appId}?stage=main`}>
        Go to Main application
      </CustomLink>
    </div>
  );
}
