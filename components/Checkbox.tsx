import React, { useState } from 'react';

function Checkbox() {
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

export default Checkbox;
