'use client';

import { createContext, useContext, useState } from 'react';
import { OnboardingInfo } from '@/types/types';

interface OnboardingContextValues {
  onboardingInfo: Partial<OnboardingInfo>;
  setOnboardingInfo: React.Dispatch<
    React.SetStateAction<Partial<OnboardingInfo>>
  >;
}

const OnboardingContext = createContext<OnboardingContextValues | null>(null);

export const useOnboardingContext = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx)
    throw new Error(
      'useOnboardingContext should only be called within OnboardingProvider',
    );
  return ctx;
};

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [onboardingInfo, setOnboardingInfo] = useState({});

  return (
    <OnboardingContext.Provider value={{ onboardingInfo, setOnboardingInfo }}>
      {children}
    </OnboardingContext.Provider>
  );
}
