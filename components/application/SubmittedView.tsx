'use client';

import CustomLink from '../CustomLink';

export default function SubmittedView() {
  return (
    <div className="flex flex-col pt-10">
      <p>Application submitted</p>
      <CustomLink href="/app">Return home</CustomLink>
    </div>
  );
}
