import React, { useState } from 'react';

export default function CreateAppButton() {
  const [variant, setVariant] = useState<'default' | 'active'>('default');

  const handleClick = () => {
    setVariant(variant === 'default' ? 'active' : 'default');
  };

  return (
    <button
      className={`rounded-2xl px-19 py-22 font-medium transition-all duration-200 ${
        variant === 'default'
          ? 'bg-gray-7 text-sm text-black hover:border-2 hover:border-gray-10'
          : 'border-2 border-blue-600 bg-blue-600 text-white shadow-lg hover:bg-blue-700'
      }`}
      onClick={handleClick}
    >
      + Create Application
    </button>
  );
}
