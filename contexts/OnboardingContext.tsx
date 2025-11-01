'use client';

import { createContext, useContext, useRef, useState } from 'react';
import { OnboardingInfo } from '@/types/types';

interface OnboardingContextValues {
  onboardingInfo: Partial<OnboardingInfo>;
  onboardingInfoRef: React.RefObject<Partial<OnboardingInfo>>;
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
  const onboardingInfoRef = useRef<Partial<OnboardingInfo>>({});

  const handleUpdateOnboardingInfo = (
    newVal: React.SetStateAction<Partial<OnboardingInfo>>,
  ) => {
    if (newVal instanceof Function)
      onboardingInfoRef.current = newVal(onboardingInfoRef.current);
    else onboardingInfoRef.current = newVal;
    setOnboardingInfo(onboardingInfoRef.current);
  };

  return (
    <OnboardingContext.Provider
      value={{
        onboardingInfo,
        onboardingInfoRef,
        setOnboardingInfo: handleUpdateOnboardingInfo,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}
