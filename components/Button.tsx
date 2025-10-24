import type { VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';

const buttonStyle = cva('', {
  variants: {
    variant: {
      default:
        'border border-gray-700 rounded-lg hover:bg-gray-50 transition-colors px-2 py-1 cursor-pointer',
      secondary:
        'border border-gray-8 bg-gray-1 rounded-lg hover:bg-cyan-12 hover:text-gray-1 transition-colors px-2 py-1 cursor-pointer text-cyan-12',
      login:
        'bg-cyan-12 rounded-lg transition-colors px-2.5 py-2.5 cursor-pointer text-gray-1',
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
