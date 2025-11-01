'use client';

import { useForm } from 'react-hook-form';
import { Button } from '../Button';
import { Textbox } from '../Textbox';

interface NameForm {
  dob: Date;
}

export default function OnboardingQuestionDOB() {
  const { register, handleSubmit } = useForm<NameForm>();

  const onSubmit = (values: NameForm) => {
    console.log(values);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <header className="flex flex-col gap-2">
        <h1>Enter your first and last name</h1>
      </header>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="dob">Date of Birth</label>
          <Textbox
            type="date"
            id="dob"
            {...register('dob', { required: true })}
          />
        </div>
      </div>

      <Button variant="primary" type="submit">
        Next
      </Button>
    </form>
  );
}
