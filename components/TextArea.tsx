import { cva } from 'class-variance-authority';
import ErrorMessage from './ErrorMessage';

const textAreaStyle = cva('', {
  variants: {
    variant: {
      default:
        'w-full rounded-lg bg-bg px-2.5 py-2 text-gray-11 placeholder:text-gray-8 outline-red-12 transition-colors duration-200 focus-visible:bg-gray-2',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export function TextArea({
  className,
  error,
  ...props
}: React.HTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  return (
    <div>
      <textarea
        {...props}
        className={textAreaStyle({ className, variant: 'default' })}
      />
      <ErrorMessage error={error} />
    </div>
  );
}
