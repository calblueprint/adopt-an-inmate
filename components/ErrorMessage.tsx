import { cn } from '@/lib/utils';

export default function ErrorMessage({
  error,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { error?: string }) {
  return error ? (
    <span className={cn(className, 'ml-auto text-error')} {...props}>
      {error}
    </span>
  ) : null;
}
