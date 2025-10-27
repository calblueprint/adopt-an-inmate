import type { VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import Link from 'next/link';
import { cva } from 'class-variance-authority';

const buttonStyle = cva(
  'cursor-pointer block text-center disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'border border-gray-700 rounded-lg hover:bg-gray-50 transition-colors px-2 py-1 cursor-pointer',
        secondary:
          'border border-gray-8 bg-gray-1 rounded-lg hover:bg-cyan-12 hover:text-gray-1 transition-colors px-2 py-1 cursor-pointer text-cyan-12',
        primary:
          'bg-cyan-12 hover:bg-cyan-10 rounded-lg transition-colors px-2.5 py-2.5 cursor-pointer text-gray-1',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed!',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      disabled: false,
    },
  },
);

type ButtonVariant = VariantProps<typeof buttonStyle>['variant'];

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
  }
>(({ children, className, variant = 'default', disabled, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={buttonStyle({ variant, className, disabled })}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = 'Button';

export const ButtonLink = forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithRef<typeof Link> & { variant?: ButtonVariant }
>(({ children, className, variant = 'default', ...props }, ref) => {
  return (
    <Link ref={ref} className={buttonStyle({ className, variant })} {...props}>
      {children}
    </Link>
  );
});
ButtonLink.displayName = 'ButtonLink';
