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
  const [howMany, setHowMany] = useState<string>('');
  const [why, setWhy] = useState<string | null>(null);
  const [whyOpen, setWhyOpen] = useState(false);

  const isComplete = () => {
    if (!adoptedBefore) return false;
    if (adoptedBefore === 'no') return true;
    if (!stillActive) return false;
    if (stillActive === 'yes') return howMany.trim() !== '';
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
              setHowMany('');
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
              setHowMany('');
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
                  setHowMany('');
                }}
              >
                <p>No</p>
              </RadioCard>
            </div>
          </div>
        )}

        {/* How many? */}
        {adoptedBefore === 'yes' && stillActive === 'yes' && (
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-11">How many?</p>
            <input
              type="number"
              min={1}
              value={howMany}
              onChange={e => setHowMany(e.target.value)}
              placeholder="Enter a number"
              className="w-full rounded-lg border border-gray-7 px-3 py-2 text-sm text-gray-12 transition-colors outline-none placeholder:text-gray-10 focus:border-red-12"
            />
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
                className="flex w-full items-center justify-between rounded-lg border border-red-12 px-3 py-2 text-sm transition-colors"
              >
                <span className={why ? 'text-gray-12' : 'text-gray-10'}>
                  {why
                    ? WHY_OPTIONS.find(o => o.value === why)?.label
                    : 'Select Reason...'}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="7"
                  viewBox="0 0 16 7"
                  fill="none"
                  className={`transition-transform ${whyOpen ? 'rotate-180' : ''}`}
                >
                  <path
                    d="M8 6.50023C7.93442 6.50103 7.86941 6.4881 7.80913 6.46227C7.74885 6.43643 7.69465 6.39827 7.65 6.35023L3.15 1.85023C2.95 1.65023 2.95 1.34023 3.15 1.14023C3.35 0.940234 3.66 0.940234 3.86 1.14023L8.01 5.29023L12.15 1.15023C12.35 0.950234 12.66 0.950234 12.86 1.15023C13.06 1.35023 13.06 1.66023 12.86 1.86023L8.36 6.36023C8.26 6.46023 8.13 6.51023 8.01 6.51023L8 6.50023Z"
                    fill="#81838D"
                  />
                </svg>
              </button>
              {whyOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-red-12 bg-white shadow-md">
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
          Submit
        </Button>
      </div>
    </div>
  );
}
