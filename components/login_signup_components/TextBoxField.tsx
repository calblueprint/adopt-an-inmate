import { useState } from 'react';
import { cva } from 'class-variance-authority';

interface TextBoxProps {
  input: string;
  placeholder: string;
}

const textBoxStyle = cva('', {
  variants: {
    variant: {
      default:
        'w-full rounded-lg bg-gray2 px-2.5 py-2 text-gray8 outline-gray11 transition-colors duration-200 focus-visible:bg-white focus-visible:text-gray8',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export function TextBox({ input, placeholder }: TextBoxProps) {
  const [info, setInfo] = useState('');

  return (
    <input
      type={input}
      placeholder={placeholder}
      value={info}
      onChange={e => setInfo(e.target.value)}
      className={textBoxStyle({ variant: 'default' })}
    />
  );
}
