import { IconType } from 'react-icons';
import { LuLoaderCircle } from 'react-icons/lu';
import { cn } from '@/lib/utils';

export default function LoadingSpinner({
  className,
  ...props
}: React.ComponentProps<IconType>) {
  return (
    <LuLoaderCircle
      className={cn('animate-spin text-gray-11', className)}
      {...props}
    />
  );
}
