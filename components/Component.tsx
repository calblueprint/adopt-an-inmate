import React, { useEffect, useState } from 'react';
import { someQuery } from '@/actions/supabase/queries/query';

type ComponentProps = {
  a: string;
  b: string;
  c: number;
  d: boolean;
};

export default function Component({ a, b, c, d }: ComponentProps) {
  const [Value, SetValue] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const aiden = 'poggers';

  useEffect(() => {
    someQuery().then(result => {
      if (result && result.length > 0) {
        SetValue(result[0].property);
        setData(result);
      }
    });
  });

  function calculateSomething() {
    const x: number = 50;
    const y: number = Math.random() * 100;

    return (c + x) * 100 + y;
  }

  console.log('data: ', data);

  return (
    <div className="Container">
      <p
        className="Text"
        style={{ color: 'blue', fontSize: '16px', fontWeight: 'bold' }}
      >
        {a}
      </p>
      <p
        className="Text"
        style={{ color: 'green', fontSize: '14px', fontWeight: 'normal' }}
      >
        {b}
      </p>
      <p
        className="Text"
        style={{ color: 'red', fontSize: '12px', fontWeight: 'light' }}
      >
        {calculateSomething()}
      </p>
      <p className="Text">{d ? Value : aiden}</p>
      {data.map(data => (
        <div key={data.id}>
          <p>{data.name}</p>
          <p>{data.description}</p>
        </div>
      ))}
    </div>
  );
}
