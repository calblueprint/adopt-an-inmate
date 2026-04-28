import Link from 'next/link';
import { cva } from 'class-variance-authority';

interface SidebarItemProps {
  label: string;
  href: string;
  active: boolean;
  children: React.ReactNode;
}

const itemStyles = cva(
  'flex items-center gap-3 rounded-lg px-4 py-3 transition-colors',
  {
    variants: {
      active: {
        true: 'bg-gray-3/80 text-gray-12/80',
        false: 'text-gray-11 hover:bg-gray-2 hover:text-gray-12',
      },
    },
  },
);

export default function SidebarItem({
  active,
  label,
  href,
  children,
}: SidebarItemProps) {
  return (
    <Link href={href} className={itemStyles({ active })}>
      {children}
      <p className="text-xl">{label}</p>
    </Link>
  );
}
