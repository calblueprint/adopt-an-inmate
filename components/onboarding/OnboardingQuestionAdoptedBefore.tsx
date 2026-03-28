'use client';

import { useState } from 'react';
import { useQuestionNavigaton } from '@/hooks/questions';
import AsyncButton from '../AsyncButton';
import Dropdown from '../Dropdown';
import QuestionBack from '../questions/QuestionBack';
import RadioCard from '../RadioCard';
import { Textbox } from '../Textbox';

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
    // TODO: wrap in form tag once `handleSubmit` created
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
            <Textbox
              type="number"
              min={'1'}
              value={howMany}
              onKeyDown={e => {
                if (['-', 'e', 'E', '.', '+', '0'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={e => setHowMany(e.target.value)}
              placeholder="Enter a number"
            />
          </div>
        )}

        {/* Why? */}
        {adoptedBefore === 'yes' && stillActive === 'no' && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-11">Why?</p>
            <div className="relative">
              <Dropdown
                value={why}
                onChange={setWhy}
                options={WHY_OPTIONS}
                placeholder="Select Reason..."
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <QuestionBack />
        <AsyncButton
          variant="primary"
          type="submit"
          disabled={!isComplete()}
          loadingClassName="text-white"
          loading={false} // TODO: add `isSubmitting` when backend linked
          onClick={handleSubmit} // also update to submit here instead of veteran question
        >
          Submit
        </AsyncButton>
      </div>
    </div>
  );
}
