import { cva } from 'class-variance-authority';

const textBoxStyle = cva('', {
  variants: {
    variant: {
      default:
        'w-full rounded-lg bg-bg px-2.5 py-2 text-gray-11 placeholder:text-gray-8 outline-gray-11 transition-colors duration-200 focus-visible:bg-gray-2',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export function Textbox({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={textBoxStyle({ className, variant: 'default' })}
    />
  );
}
