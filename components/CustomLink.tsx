import type { VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { cva } from 'class-variance-authority';

const linkVariant = cva('', {
  variants: {
    variant: {
      default: 'text-blue-700 hover:underline',
      secondary: 'text-gray-9 underline',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type LinkVariantProp = VariantProps<typeof linkVariant>['variant'];

export default function CustomLink({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof Link> & { variant?: LinkVariantProp }) {
  return <Link className={linkVariant({ variant, className })} {...props} />;
}
