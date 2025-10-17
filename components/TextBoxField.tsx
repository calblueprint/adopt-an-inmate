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
        className="w-full rounded-[8px] bg-[#EDEBE9] px-[10px] py-[8px] text-[#BABBC7] outline-gray11 transition-colors duration-200 focus-visible:bg-white focus-visible:text-gray11"
      />
    </div>
  );
}
