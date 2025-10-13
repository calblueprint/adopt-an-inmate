import { useState } from 'react';

interface TextBoxProps {
  input: string;
  placeholder: string;
}

export function TextBox({ input, placeholder }: TextBoxProps) {
  const [info, setInfo] = useState('');

  return (
    <div>
      <input
        type={input}
        placeholder={placeholder}
        value={info}
        onChange={e => setInfo(e.target.value)}
        className="h-[2.188rem] w-full rounded-[8px] bg-[#EDEBE9] pt-[8px] pr-[10px] pb-[8px] pl-[10px] text-[#BABBC7] outline-gray11 transition-colors duration-200 focus-visible:bg-white focus-visible:text-gray11"
      />
    </div>
  );
}
