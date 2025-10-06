'use client';

import type { ApplicationState } from '@/types/types';
import { createContext, useContext, useState } from 'react';

interface ApplicationContextValues {
  appState: ApplicationState;
  setAppState: React.Dispatch<React.SetStateAction<ApplicationState>>;
}

const ApplicationContext = createContext<ApplicationContextValues | null>(null);

export function useApplicationContext() {
  const ctx = useContext(ApplicationContext);
  if (ctx === null)
    throw new Error(
      'useApplicationContext should be called within an ApplicationContextProvider',
    );
  return ctx;
}

export function ApplicationContextProvider({
  children,
  defaultAppState,
}: {
  children: React.ReactNode;
  defaultAppState: ApplicationState;
}) {
  const [appState, setAppState] = useState(defaultAppState);

  return (
    <ApplicationContext.Provider value={{ appState, setAppState }}>
      {children}
    </ApplicationContext.Provider>
  );
}
