'use client';

import { useState } from 'react';
import { useQuestionNavigaton } from '@/hooks/questions';
import { Button } from '../Button';
import QuestionBack from '../questions/QuestionBack';
import RadioCard from '../RadioCard';

const WHY_OPTIONS = [
  { label: 'Ended', value: 'ended' },
  { label: 'Inmate Cancelled', value: 'inmate_cancelled' },
  { label: 'NPO Cancelled', value: 'npo_cancelled' },
  { label: 'Other', value: 'other' },
];

export default function OnboardingQuestionAdoptedBefore() {
  const { nextQuestion } = useQuestionNavigaton();

  const [adoptedBefore, setAdoptedBefore] = useState<'yes' | 'no' | null>(null);
  const [stillActive, setStillActive] = useState<'yes' | 'no' | null>(null);
  const [howMany, setHowMany] = useState<number | null>(null);
  const [why, setWhy] = useState<string | null>(null);
  const [whyOpen, setWhyOpen] = useState(false);

  const isComplete = () => {
    if (!adoptedBefore) return false;
    if (adoptedBefore === 'no') return true;
    if (!stillActive) return false;
    if (stillActive === 'yes') return howMany !== null;
    if (stillActive === 'no') return why !== null;
    return false;
  };

  const handleSubmit = () => {
    if (!isComplete()) return;
    nextQuestion();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2">
        <h1>Have you adopted before?</h1>
      </header>

      <div className="flex flex-col gap-4">
        {/* Have you adopted before? */}
        <div className="flex flex-col gap-2">
          <RadioCard
            value="yes"
            name="adoptedBefore"
            checked={adoptedBefore === 'yes'}
            onChange={() => {
              setAdoptedBefore('yes');
              setStillActive(null);
              setHowMany(null);
              setWhy(null);
            }}
          >
            <p>Yes</p>
          </RadioCard>
          <RadioCard
            value="no"
            name="adoptedBefore"
            checked={adoptedBefore === 'no'}
            onChange={() => {
              setAdoptedBefore('no');
              setStillActive(null);
              setHowMany(null);
              setWhy(null);
            }}
          >
            <p>No</p>
          </RadioCard>
        </div>

        {/* Is it still active? */}
        {adoptedBefore === 'yes' && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-11">Is it still active?</p>
            <div className="flex flex-col gap-2">
              <RadioCard
                value="yes"
                name="stillActive"
                checked={stillActive === 'yes'}
                onChange={() => {
                  setStillActive('yes');
                  setWhy(null);
                }}
              >
                <p>Yes</p>
              </RadioCard>
              <RadioCard
                value="no"
                name="stillActive"
                checked={stillActive === 'no'}
                onChange={() => {
                  setStillActive('no');
                  setHowMany(null);
                }}
              >
                <p>No</p>
              </RadioCard>
            </div>
          </div>
        )}

        {/* How many? */}
        {adoptedBefore === 'yes' && stillActive === 'yes' && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-11">How many?</p>
            <div className="flex gap-2">
              {[1, 2].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setHowMany(n)}
                  className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
                    howMany === n
                      ? 'border-red-12 bg-red-2 text-red-12'
                      : 'border-gray-7 text-gray-11 hover:border-gray-9'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Why? */}
        {adoptedBefore === 'yes' && stillActive === 'no' && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-11">Why?</p>
            <div className="relative">
              <button
                type="button"
                onClick={() => setWhyOpen(prev => !prev)}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
                  why
                    ? 'border-red-12 text-gray-12'
                    : 'border-gray-7 text-gray-10'
                }`}
              >
                {why
                  ? WHY_OPTIONS.find(o => o.value === why)?.label
                  : 'Select Reason...'}
                <span className="text-gray-10">{whyOpen ? '▲' : '▼'}</span>
              </button>
              {whyOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-7 bg-white shadow-md">
                  {WHY_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setWhy(option.value);
                        setWhyOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-red-2 hover:text-red-12"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <QuestionBack />
        <Button
          variant="primary"
          type="button"
          disabled={!isComplete()}
          onClick={handleSubmit}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
