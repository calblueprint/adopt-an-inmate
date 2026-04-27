import { LuChevronLeft } from 'react-icons/lu';
import { motion } from 'motion/react';
import { Button } from '@/components/Button';
import { ApplicationDialogTabs } from './ApplicationPreviewDialog';

interface DialogExtraFormProps {
  value: ApplicationDialogTabs;
  activeTab: ApplicationDialogTabs;
  setActiveTab: React.Dispatch<React.SetStateAction<ApplicationDialogTabs>>;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function DialogExtraForm({
  value,
  activeTab,
  setActiveTab,
  title,
  description,
  children,
}: DialogExtraFormProps) {
  return (
    <motion.div
      className="absolute inset-0 flex h-full w-full justify-center overflow-auto py-8"
      initial={{ x: '100%' }}
      animate={{ x: activeTab === value ? 0 : '100%' }}
      transition={{ duration: 0.2, type: 'tween', ease: 'easeInOut' }}
    >
      <section className="w-1/2 min-w-72">
        <div className="flex h-full w-full flex-col gap-2">
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

          {/* padding */}
          <div className="pb-8" />
        </div>
      </section>
    </motion.div>
  );
}
