import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const PasswordInput = ({ id, ...props }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Lock className="input-icon" />
      <input {...props} id={id} type={visible ? 'text' : 'password'} className="input pl-11 pr-12" />
      <button type="button" onClick={() => setVisible(!visible)} className="icon-button absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2" aria-label={visible ? 'Hide password' : 'Show password'} aria-controls={id} aria-pressed={visible}>
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
};

export default PasswordInput;
