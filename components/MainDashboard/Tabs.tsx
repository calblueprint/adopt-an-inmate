import { Tabs } from 'radix-ui';
import ApplicationCard from './ApplicationCard';

export default function TabsDemo() {
  return (
    <Tabs.Root className="w-full" defaultValue="active">
      <Tabs.List
        className="justify-items-center border-b-2 border-b-gray-300"
        aria-label="Manage your account"
      >
        <div className="flex w-full">
          <Tabs.Trigger
            className="-mb-[2px] flex-1 border-b-2 border-b-transparent px-4 pb-2 text-gray-400 transition-colors data-[state=active]:border-b-cyan-9 data-[state=active]:text-cyan-9"
            value="active"
          >
            Active Applications
          </Tabs.Trigger>

          <Tabs.Trigger
            className="-mb-[2px] flex-1 border-b-2 border-b-transparent px-4 pb-2 text-gray-400 transition-colors data-[state=active]:border-b-cyan-9 data-[state=active]:text-cyan-9"
            value="inactive"
          >
            Inactive Applications
          </Tabs.Trigger>
        </div>
      </Tabs.List>
      <Tabs.Content className="min-h-130 w-full pt-9 pb-9" value="active">
        <div className="flex flex-row flex-wrap gap-x-12 gap-y-14">
          <ApplicationCard />
          <ApplicationCard />
          <ApplicationCard />
          <ApplicationCard />
          <ApplicationCard />
        </div>
      </Tabs.Content>
      <Tabs.Content className="min-h-130 w-full pt-9 pb-9" value="inactive">
        <div className="flex flex-row flex-wrap gap-x-12 gap-y-14">
          <ApplicationCard />
          <ApplicationCard />
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}
