import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const requirements = [
    {
      text: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      text: 'Contains uppercase letter',
      met: /[A-Z]/.test(password),
    },
    {
      text: 'Contains lowercase letter',
      met: /[a-z]/.test(password),
    },
    {
      text: 'Contains number',
      met: /[0-9]/.test(password),
    },
    {
      text: 'Contains special character',
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const strength = requirements.filter(req => req.met).length;
  const strengthPercentage = (strength / requirements.length) * 100;

  return (
    <div className="space-y-2">
      <div className="h-1 bg-border-dark rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${strengthPercentage}%` }}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center text-sm">
            {req.met ? (
              <Check className="w-4 h-4 text-primary mr-2" />
            ) : (
              <X className="w-4 h-4 text-red-500 mr-2" />
            )}
            <span className={req.met ? 'text-text-dark' : 'text-text-dark opacity-60'}>
              {req.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength;