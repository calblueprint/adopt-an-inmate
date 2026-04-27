import { cva } from 'class-variance-authority';
import ErrorMessage from './ErrorMessage';

const textAreaStyle = cva('', {
  variants: {
    variant: {
      default:
        'w-full rounded-lg bg-input px-2.5 py-2 text-gray-10 placeholder:text-gray-10 ring-1 ring-transparent focus-within:ring-gray-9 outline-none transition-colors duration-200 focus-visible:bg-gray-2',
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
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
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
