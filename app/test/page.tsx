'use client';

import { useEffect } from 'react';
import { fetchTopK } from '../../actions/queries/query';

export default function TestTopKPage() {
  useEffect(() => {
    async function test() {
      const embedding = Array.from(
        { length: 384 },
        () => Math.random() * 2 - 1,
      );
      const k_value = 3;
      const gender = 'female';
      const age = 70;
      const veteran_status = true;
      const offense = null;
      const state = 'Wyoming';
      const data = await fetchTopK(
        embedding,
        k_value,
        gender,
        age,
        veteran_status,
        offense,
        state,
      );
      console.log('Top K results:', data);
      console.log(
        'For the vals of: ',
        gender,
        age,
        veteran_status,
        offense,
        state,
      );
    }
    test();
  }, []);

  return <div>Check the browser console duhhh</div>;
}
