import { LuChevronLeft } from 'react-icons/lu';
import { Tabs } from 'radix-ui';
import { Button } from '@/components/Button';
import { ApplicationDialogTabs } from './ApplicationPreviewDialog';

interface DialogExtraFormProps {
  value: string;
  setActiveTab: React.Dispatch<React.SetStateAction<ApplicationDialogTabs>>;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function DialogExtraForm({
  value,
  setActiveTab,
  title,
  description,
  children,
}: DialogExtraFormProps) {
  return (
    <Tabs.Content value={value} className="flex h-full w-full flex-col gap-2">
      <div className="relative">
        <div className="absolute top-1/2 -left-4 -translate-x-full -translate-y-1/2">
          <Button variant="ghost" onClick={() => setActiveTab('main')}>
            <LuChevronLeft />
          </Button>
        </div>

        <h2>{title}</h2>
      </div>
      <p className="text-gray-12/60">{description}</p>
      {children}
    </Tabs.Content>
  );
}
