'use client';

import { useEffect } from 'react';
import {
  fetchApplication,
  fetchUserApplicationUUIDs,
} from '@/actions/queries/query';

export default function TestApplicationPage() {
  useEffect(() => {
    async function test() {
      const app_UUID = '4c08d9d6-90fa-4cf8-8846-a8e9463069fe';
      const app_data = await fetchApplication(app_UUID);
      console.log('from fetch app:', app_data);

      const adopter_UUID = '297a39c3-a21f-4ec7-86e1-cc3c003cda26';
      const adopter_data = await fetchUserApplicationUUIDs(adopter_UUID);
      console.log('from fetch apps for adopter:', adopter_data);
    }

    test();
  }, []);

  return <div>Check the browser console silly...</div>;
}
