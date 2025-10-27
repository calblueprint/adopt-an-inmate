'use client';

import { createContext, useContext, useState } from 'react';

interface ForgotPasswordContextValues {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

const ForgotPasswordContext = createContext<ForgotPasswordContextValues | null>(
  null,
);

export const useForgotPasswordContext = () => {
  const ctx = useContext(ForgotPasswordContext);
  if (!ctx)
    throw new Error(
      'useForgotPasswordContext must be used within a ForgotPasswordContextProvider',
    );
  return ctx;
};

export function ForgotPasswordContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [email, setEmail] = useState('');

  return (
    <ForgotPasswordContext.Provider value={{ email, setEmail }}>
      {children}
    </ForgotPasswordContext.Provider>
  );
}
