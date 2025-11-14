'use client';

import type { ApplicationState } from '@/types/types';
import { createContext, useContext, useRef, useState } from 'react';
import { ApplicationStage } from '@/types/enums';

interface ApplicationContextValues {
  appState: ApplicationState;
  setAppState: React.Dispatch<React.SetStateAction<ApplicationState>>;
  appStage: React.RefObject<ApplicationStage>;
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
  defaultStage,
}: {
  children: React.ReactNode;
  defaultAppState: ApplicationState;
  defaultStage: ApplicationStage;
}) {
  const [appState, setAppState] = useState(defaultAppState);
  const appStage = useRef(defaultStage);

  return (
    <ApplicationContext.Provider value={{ appState, setAppState, appStage }}>
      {children}
    </ApplicationContext.Provider>
  );
}
