import { ImCheckmark } from 'react-icons/im';
import { cva } from 'class-variance-authority';

const checkboxStyles = cva('peer', {
  variants: {
    variant: {
      default:
        'appearance-none size-5 rounded border-2 border-red-10 text-red-10 checked:bg-red-10 transition-colors',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export default function Checkbox({
  className,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  return (
    <div className="relative grid place-items-center">
      <input
        type="checkbox"
        className={checkboxStyles({ className })}
        {...props}
      />
      <ImCheckmark
        size={10}
        color="var(--color-red-1)"
        className="absolute top-1/2 left-1/2 -translate-1/2 opacity-0 transition-opacity peer-checked:opacity-100"
      />
    </div>
  );
}
