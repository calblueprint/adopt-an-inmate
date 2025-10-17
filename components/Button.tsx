import type { VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';

const buttonStyle = cva('', {
  variants: {
    variant: {
      default:
        'border border-gray-700 rounded-lg hover:bg-gray-50 transition-colors px-2 py-1 cursor-pointer',
      secondary:
        'border border-[#BABBC7] bg-[#FCFCFD] rounded-lg hover:bg-[#1E4240] hover:text-[#FCFCFD] transition-colors px-2 py-1 cursor-pointer bg-[#FCFCFD] text-[#1E4240]',
      login:
        'bg-cyan12 rounded-lg transition-colors px-2 py-1 cursor-pointer text-[#FCFCFD]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type ButtonVariantProp = VariantProps<typeof buttonStyle>['variant'];

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariantProp;
  }
>(({ children, className, variant = 'default', ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={buttonStyle({ variant, className })}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = 'Button';
