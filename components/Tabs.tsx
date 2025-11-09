import * as React from 'react';
import { Tabs } from 'radix-ui';
import ApplicationCard from './ApplicationCard';

const TabsDemo = () => (
  <Tabs.Root className="flex flex-col" defaultValue="active">
    <Tabs.List
      className="justify-items-center border-b-2 border-b-gray-300"
      aria-label="Manage your account"
    >
      <div className="flex gap-x-66">
        <Tabs.Trigger
          className="-mb-[2px] border-b-2 border-b-transparent px-4 pb-2 text-gray-400 transition-colors data-[state=active]:border-b-cyan-9 data-[state=active]:text-cyan-9"
          value="active"
        >
          Active Applications
        </Tabs.Trigger>
        <Tabs.Trigger
          className="-mb-[2px] border-b-2 border-b-transparent px-4 pb-2 text-gray-400 transition-colors data-[state=active]:border-b-cyan-9 data-[state=active]:text-cyan-9"
          value="inactive"
        >
          Inactive Applications
        </Tabs.Trigger>
      </div>
    </Tabs.List>
    <Tabs.Content
      className="flex flex-row flex-wrap gap-x-12 gap-y-14 pt-9 pb-9"
      value="active"
    >
      <ApplicationCard />
      <ApplicationCard />
      <ApplicationCard />
      <ApplicationCard />
      <ApplicationCard />
    </Tabs.Content>
    <Tabs.Content
      className="flex flex-row flex-wrap gap-x-12 gap-y-14 pt-9 pb-9"
      value="inactive"
    >
      <ApplicationCard />
      <ApplicationCard />
    </Tabs.Content>
  </Tabs.Root>
);

export default TabsDemo;
