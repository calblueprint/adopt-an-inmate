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
  //const [whyOpen, setWhyOpen] = useState(false);

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
            {/* <input
              type="number"
              min={1}
              value={howMany}
              onChange={e => setHowMany(e.target.value)}
              placeholder="Enter a number"
              className="w-full rounded-lg border border-gray-7 px-3 py-2 text-sm text-gray-12 transition-colors outline-none placeholder:text-gray-10 focus:border-red-12"
            /> */}
            <Textbox
              type="number"
              min={1}
              value={howMany}
              onChange={e => setHowMany(e.target.value)}
              placeholder="Enter a number"
              //inputMode="numeric" do we need?
            />
          </div>
        )}

        {/* Why? */}
        {adoptedBefore === 'yes' && stillActive === 'no' && (
          <Dropdown
            value={why}
            onChange={setWhy}
            options={WHY_OPTIONS}
            placeholder="Select Reason..."
          />
        )}
        {/* // (
        //   <div className="flex flex-col gap-2">
        //     <p className="text-sm text-gray-11">Why?</p>
        //     <div className="relative">
        //       <button
        //         type="button"
        //         onClick={() => setWhyOpen(prev => !prev)}
        //         className="flex w-full items-center justify-between rounded-lg border border-red-12 px-3 py-2 text-sm transition-colors"
        //       >
        //         <span className={why ? 'text-gray-12' : 'text-gray-10'}>
        //           {why
        //             ? WHY_OPTIONS.find(o => o.value === why)?.label
        //             : 'Select Reason...'}
        //         </span>
        //         <SlArrowDown
        //           className={`text-gray-10 transition-transform duration-200 ${
        //             whyOpen ? 'rotate-180' : ''
        //           }`}
        //         />
        //       </button>
        //       {whyOpen && (
        //         <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-red-12 bg-white shadow-md">
        //           {WHY_OPTIONS.map(option => (
        //             <button
        //               key={option.value}
        //               type="button"
        //               onClick={() => {
        //                 setWhy(option.value);
        //                 setWhyOpen(false);
        //               }}
        //               className="w-full px-3 py-2 text-left text-sm hover:bg-red-2 hover:text-red-12"
        //             >
        //               {option.label}
        //             </button>
        //           ))}
        //         </div>
        //       )}
        //     </div>
        //   </div>
        // )} */}
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
          Next
        </AsyncButton>
      </div>
    </div>
  );
}
