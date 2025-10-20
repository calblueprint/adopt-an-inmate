import { MdOutlineCheckCircle } from 'react-icons/md';
import { Button } from '@/components/Button';

export default function QuestionSuccess() {
  return (
    <div className="space-y-2">
      <div className="grid w-full place-items-center">
        <MdOutlineCheckCircle size={64} className="text-red-12" />
      </div>
      <h1>Success!</h1>
      <p>
        Based on your answers, you&apos;re eligible to apply as an Adopter for
        Adopt an Inmate. Press continue to finish your application.
      </p>
      <div className="mt-6">
        <Button variant="primary" className="w-full py-2">
          Continue
        </Button>
      </div>
    </div>
  );
}
