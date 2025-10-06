import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';

const buttonStyle = cva('', {
  variants: {
    variant: {
      default:
        'border border-gray-700 rounded-lg hover:bg-gray-50 transition-colors px-2 py-1 cursor-pointer',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className, ...props }, ref) => {
  return (
    <button ref={ref} className={buttonStyle({ className })} {...props}>
      {children}
    </button>
  );
});
Button.displayName = 'Button';
