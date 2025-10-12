import {useState} from 'react';

export function Login() {

  const [email, setEmail] = useState('');

  return (
    <div>
      <input
        type="email"
        placeholder="jamie@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full bg-[#EDEBE9] h-[2.188rem] rounded-[8px] text-[#BABBC7] pt-[8px] pb-[8px] pr-[10px] pl-[10px]"
      />
    </div>
  );
}

interface GenProps {
  input: string;
  placeholder: string;
}

export function TextBox({input, placeholder}: GenProps) {

  const [info, setInfo] = useState('');

  return (
    <div>
      <input
        type={input}
        placeholder={placeholder}
        value={info}
        onChange={(e) => setInfo(e.target.value)}
        className="w-full bg-[#EDEBE9] h-[2.188rem] rounded-[8px] text-[#BABBC7] pt-[8px] pb-[8px] pr-[10px] pl-[10px]"
      />
    </div>
  );
}