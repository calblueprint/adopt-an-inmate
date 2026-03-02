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
  initialQuestionsCompleted,
}: {
  children: React.ReactNode;
  questions: React.ReactNode[];
  initialQuestionsCompleted?: number;
}) {
  const [questionsCompleted, setQuestionsCompleted] = useState<number>(
    initialQuestionsCompleted ?? 0,
  );

  return (
    <QuestionsContext.Provider
      value={{ questionsCompleted, questions, setQuestionsCompleted }}
    >
      {children}
    </QuestionsContext.Provider>
  );
}
