'use client';

import { Button } from './Button';
import CustomLink from './CustomLink';
import { TextBox } from './TextBoxField';

export function LogInCard() {
  return (
    <div className="flex h-1/2 w-[26.438rem] flex-col rounded-[0.938rem] bg-[#FDFDFD]">
      <div className="pt-[27px] pr-[30px] pb-[27px] pl-[30px]">
        <div className="p-b-[1.188rem]">
          <p className="font-bespoke text-[26px] font-bold not-italic">
            Log in
          </p>
        </div>

        <div className="flex flex-col pt-[19px] pb-[1.25rem]">
          <div className="flex flex-col">
            {/* This is the Email title and textbox */}
            <div className="flex flex-col gap-[0px]">
              <p className="font-bespokevar text-[16px] font-normal text-[#8C8D99] not-italic">
                Email
              </p>
              <TextBox input="email" placeholder="jamie@example.com" />
            </div>

            {/* This is the password title and textbox */}
            <div className="flex flex-col gap-[0px]">
              <div className="flex flex-row justify-between pt-[16px]">
                <p className="font-bespokevar text-[16px] font-normal text-[#8C8D99] not-italic">
                  Password
                </p>
                <CustomLink
                  variant="secondary"
                  className="text-[13px]"
                  href="/"
                >
                  Forgot your password?
                </CustomLink>
              </div>

              <TextBox input="password" placeholder="Password" />
            </div>
          </div>
          <Button variant="login" className="mt-[27px]">
            Login
          </Button>
        </div>

        <hr className="h-[2px] w-full border border-t-2 border-[#E1E1E1]" />

        <div className="flex flex-row items-center justify-between pt-[2rem]">
          <p className="font-bespoke text-[0.813rem] font-medium text-[#1E1F24]">
            Don&#39;t have an account?
          </p>
          <Button variant="secondary">Sign Up</Button>
        </div>
      </div>
    </div>
  );
}
