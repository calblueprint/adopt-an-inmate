import { FaHandHoldingHeart } from 'react-icons/fa';
import { ButtonLink } from '@/components/Button';

export default function OnboardingComplete() {
  return (
    <div className="flex flex-col gap-2">
      <div className="my-6 grid w-full place-items-center">
        <FaHandHoldingHeart size={64} className="text-red-12" />
      </div>
      <h1>Thank you!</h1>
      <p>
        Thanks for providing your information! We will only use this to help us
        match you with an adoptee.
      </p>
      <div className="mt-6">
        <ButtonLink href="/" variant="primary" className="w-full py-2">
          Continue
        </ButtonLink>
      </div>
    </div>
  );
}
