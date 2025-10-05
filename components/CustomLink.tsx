import Link from 'next/link';
import { cva } from 'class-variance-authority';

type LinkVariant = 'default';

const linkVariant = cva('', {
  variants: {
    variant: {
      default: 'text-blue-700 hover:underline',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export default function CustomLink({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof Link> & { variant?: LinkVariant }) {
  return <Link className={linkVariant({ variant, className })} {...props} />;
}
