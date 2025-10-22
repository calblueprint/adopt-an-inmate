'use client';

import CustomLink from '@/components/CustomLink';

export default function StageSubmitted() {
  return (
    <div className="flex flex-col pt-10">
      <p>Application submitted</p>
      <CustomLink href="/app">Return home</CustomLink>
    </div>
  );
}
