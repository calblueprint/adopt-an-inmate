'use client';

import { createContext, useContext, useState } from 'react';

interface QuestionsContextProps {
  questionsCompleted: number;
  setQuestionsCompleted: React.Dispatch<React.SetStateAction<number>>;
  questions: React.ReactNode[];
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
  questions,
}: {
  children: React.ReactNode;
  questions: React.ReactNode[];
}) {
  const [questionsCompleted, setQuestionsCompleted] = useState<number>(0);

  return (
    <QuestionsContext.Provider
      value={{ questionsCompleted, questions, setQuestionsCompleted }}
    >
      {children}
    </QuestionsContext.Provider>
  );
}
