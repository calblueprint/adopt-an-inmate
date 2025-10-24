import React, { useState } from 'react';

interface CheckboxProps {
  type: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Checkbox() {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  return (
    <div>
      <input type="checkbox" checked={isChecked} onChange={handleChange} />
    </div>
  );
}
