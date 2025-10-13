'use client';

import { Button } from './Button';
import Checkbox from './Checkbox';
import { TextBox } from './TextBoxField';

export function SignUpCard() {
  return (
    <div className="flex h-1/2 w-[26.438rem] flex-col rounded-[0.938rem] bg-[#FDFDFD]">
      <div className="pt-[27px] pr-[30px] pb-[27px] pl-[30px]">
        <div className="p-b-[1.188rem]">
          <p className="font-[Bespoke Sans Variable] text-[26px] font-[500] font-bold font-normal not-italic">
            Sign Up
          </p>
          <p className="text-[#969696]">
            Already have an account?{' '}
            <a href="/" target="_blank" className="text-[#1D69B3]">
              Sign In
            </a>
          </p>
        </div>

        <div className="flex flex-col pt-[19px] pb-[1.25rem]">
          <div className="flex flex-col gap-[23px]">
            {/* This is the Email title and textbox */}
            <div className="flex flex-col gap-[0px]">
              <p className="font-[Bespoke Sans Variable] text-[13px] font-normal text-[#8C8D99] not-italic">
                Email
              </p>
              <TextBox input="email" placeholder="jamie@example.com" />
            </div>

            {/* This is the password title and textbox */}
            <div className="flex flex-col gap-[0px]">
              <p className="font-[Bespoke Sans Variable] text-[13px] font-normal text-[#8C8D99] not-italic">
                Password
              </p>
              <TextBox input="password" placeholder="Password" />
            </div>

            {/* This is the password confirmation title and textbox */}
            <div className="flex flex-col gap-[0px]">
              <p className="font-[Bespoke Sans Variable] text-[13px] font-normal text-[#8C8D99] not-italic">
                Password Confirmation
              </p>
              <TextBox input="password confirm" placeholder="Password" />
            </div>
          </div>

          {/* This is the checkbox and the terms of service line */}
          <div className="flex flex-row gap-[7px] pt-[31px]">
            <Checkbox />
            <p>I&#39;ve read and agreed to the terms of service</p>
          </div>

          <Button variant="login" className="mt-[27px]">
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
