'use client';

import { FaHandHoldingHeart } from 'react-icons/fa';
import { ButtonLink } from '@/components/Button';

export default function StageSubmitted() {
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <div className="flex h-[404px] w-[447px] flex-col gap-6 rounded-lg bg-gray-1 p-8 sm:w-[clamp(400px,50%,500px)]">
        <div className="my-6 grid w-full place-items-center">
          <FaHandHoldingHeart size={64} className="text-red-12" />
        </div>
        <div className="flex flex-col gap-14">
          <div className="flex flex-col gap-2">
            <h1 className="text-center text-[32px] leading-normal text-gray-12">
              Thank you!
            </h1>
            <p className="text-center text-[14px] leading-normal text-gray-11">
              Thank you for submitting your application. Please check your email
              for next steps and updates.
            </p>
          </div>

          <ButtonLink href="/app" variant="primary" className="py-2">
            Back to Home
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
