'use client';

import { createContext, useContext, useState } from 'react';

interface QuestionsContextProps {
  questionsCompleted: number;
  numQuestions: number;
  setQuestionsCompleted: React.Dispatch<React.SetStateAction<number>>;
}

const QuestionsContext = createContext<QuestionsContextProps | null>(null);

export const useQuestionsContext = () => {
  const ctx = useContext(QuestionsContext);
  if (!ctx)
    throw new Error(
      'useQuestionsContext must be called within a QuestionsContextProvider',
    );
  return ctx;
};

export function QuestionsContextProvider({
  children,
  numQuestions,
}: {
  children: React.ReactNode;
  numQuestions: number;
}) {
  const [questionsCompleted, setQuestionsCompleted] = useState<number>(0);

  return (
    <QuestionsContext.Provider
      value={{ questionsCompleted, numQuestions, setQuestionsCompleted }}
    >
      {children}
    </QuestionsContext.Provider>
  );
}
