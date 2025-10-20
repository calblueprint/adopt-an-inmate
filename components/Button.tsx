import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';

type ButtonVariant = 'default' | 'primary';

const buttonStyle = cva('cursor-pointer', {
  variants: {
    variant: {
      default:
        'border border-gray-700 rounded-lg hover:bg-gray-50 transition-colors px-2 py-1',
      primary:
        'bg-cyan-12 text-white rounded-lg px-4 py-1 hover:bg-cyan-10 transition-colors',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }
>(({ children, className, variant = 'default', ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={buttonStyle({ className, variant })}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = 'Button';
