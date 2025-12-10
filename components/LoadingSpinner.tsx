import { LuLoaderCircle } from 'react-icons/lu';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const spinnerStyles = cva('animate-spin', {
  variants: {
    variant: {
      default: 'text-gray-11 w-4 h-4',
      button: 'text-gray-1 w-6 h-6',
      buttonSm: 'text-gray-1 size-4',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface LoadingSpinnerProps
  extends React.ComponentProps<typeof LuLoaderCircle>,
    VariantProps<typeof spinnerStyles> {}

export default function LoadingSpinner({
  className,
  variant,
  ...props
}: LoadingSpinnerProps) {
  return (
    <LuLoaderCircle
      className={cn(spinnerStyles({ variant }), className)}
      {...props}
    />
  );
}
