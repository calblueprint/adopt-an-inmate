import type { VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import Link from 'next/link';
import { cva } from 'class-variance-authority';

const buttonStyle = cva(
  'cursor-pointer flex items-center gap-2 justify-center text-center px-3 py-1 transition-colors',
  {
    variants: {
      variant: {
        default: 'border border-gray-700 rounded-lg',
        secondary: 'border border-gray-8 bg-gray-1 rounded-lg text-cyan-12',
        primary: 'bg-cyan-12 rounded-lg text-gray-1',
        tertiary: 'bg-cyan-9 text-white rounded-lg py-3 px-4',
        rounded: 'rounded-full px-6 bg-red-12 text-gray-1',
        ghost:
          'p-2! rounded-lg after:content-[""] relative z-2 after:absolute after:top-1/2 after:left-1/2 after:size-full after:-translate-1/2 after:rounded-lg after:bg-white/50 after:opacity-0 after:z-1 after:transition-opacity',
      },
      disabled: {
        true: 'opacity-60 cursor-not-allowed!',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        disabled: false,
        className: 'hover:bg-cyan-9',
      },
      {
        variant: 'secondary',
        disabled: false,
        className: 'hover:bg-cyan-9/10',
      },
      {
        variant: 'primary',
        disabled: false,
        className: 'hover:bg-cyan-10',
      },
      {
        variant: 'rounded',
        disabled: false,
        className: 'hover:bg-cyan-9',
      },
      {
        variant: 'ghost',
        disabled: false,
        className: 'hover:after:opacity-100',
      },
    ],
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
>(({ children, className, disabled, variant = 'default', ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={buttonStyle({ variant, disabled, className })}
      disabled={disabled}
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
