'use client';

import { useForm } from 'react-hook-form';
import { Button } from '../Button';
import { Textbox } from '../Textbox';

interface NameForm {
  firstName: string;
  lastName: string;
}

export default function OnboardingQuestionName() {
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
          <label htmlFor="firstName">First name</label>
          <Textbox
            id="firstName"
            {...register('firstName', { required: true })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="lastName">Last name</label>
          <Textbox
            id="lastName"
            {...register('lastName', { required: true })}
          />
        </div>
      </div>

      <Button variant="primary" type="submit">
        Next
      </Button>
    </form>
  );
}
