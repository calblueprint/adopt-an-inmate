'use client';
import { Button } from "./Button";
import CustomLink from "./CustomLink";
import { Login, TextBox } from "./LoginField";



interface TextBoxProps {
  text: string;
}

// export function TextBoxEnter(props: TextBoxProps) {
//   return (
//     <div>
//       {/* This is going to be the Title of the TextBox */}
//       <div className="border border-green-500">
//         <p className="font-[Bespoke Sans Variable] text-[16px] text-[#8C8D99] font-normal not-italic">{props.text}</p>
//       </div>

//       {/* This is going to be where the user actually enters their information */}
//       <UserInfoInput />
//       <TextBox input="password" placeholder="Password"></TextBox>
//     </div>
//   );
// }

// export function UserInfoInput() {
//   // const [formData, setFormData] = useState({
//   //   info: ""
//   // });

//   return (
//     <div className="flex box-border border-indigo-500/100 rounded-[8px] border bg-[#EDEBE9] p-5 ">
      

//     </div>
//   )
// }

export function LogInCard() {
  return (
    <div className="flex flex-col w-[26.438rem] h-1/2 bg-[#FDFDFD] rounded-[0.938rem]">

      <div className="pt-[27px] pb-[27px] pr-[30px] pl-[30px]">
        <div className="p-b-[1.188rem]">
        <p className="text-[26px] font-[Bespoke Sans Variable] font-normal not-italic font-bold font-[500]">Log in</p>
      </div>
      
      <div className="flex flex-col pt-[19px] pb-[1.25rem]">
        <div className="flex flex-col">
          
          {/* This is the Email title and textbox */}
          <div className="flex flex-col gap-[0px]">
            <p className="font-[Bespoke Sans Variable] text-[16px] text-[#8C8D99] font-normal not-italic">Email</p>
            <TextBox input="email" placeholder="jamie@example.com"/>
          </div>
          

          {/* This is the forgot your password line */}
          <div className="flex flex-row justify-end pt-[16px] pb-[0px]">
            <CustomLink variant="secondary" className="text-[13px]" href="/">Forgot your password?</CustomLink>
          </div>

          {/* This is the password title and textbox */}
          <div className="flex flex-col gap-[0px]">
            <p className="font-[Bespoke Sans Variable] text-[16px] text-[#8C8D99] font-normal not-italic">Password</p>
            <TextBox input="password" placeholder="Password"/>
          </div>

        </div>
        <Button variant="login" className="mt-[27px]">Login</Button>
      </div>

      <hr className="border h-[2px] border-t-2 border-[#E1E1E1] w-full"/>
      
      <div className="flex flex-row justify-between items-center pt-[2rem]">
        <p className="font-[Bespoke Sans Variable] text-[0.813rem] text-[#1E1F24]">Dont have an account?</p>
        <Button variant="secondary">Sign Up</Button>
      </div>
      </div>      

    </div>
  )
}