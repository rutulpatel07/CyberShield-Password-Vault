
import { Shield } from 'lucide-react';

interface StrengthCriteria {
  regex: RegExp;
  description: string;
}

export const strengthCriteria: StrengthCriteria[] = [
  { regex: /.{8,}/, description: "At least 8 characters long" },
  { regex: /[A-Z]/, description: "Contains uppercase letter" },
  { regex: /[a-z]/, description: "Contains lowercase letter" },
  { regex: /[0-9]/, description: "Contains number" },
  { regex: /[^A-Za-z0-9]/, description: "Contains special character" },
];

interface Props {
  password: string;
  strengthScore: number;
}

const PasswordStrength: React.FC<Props> = ({ password, strengthScore }) => {
  const percentage = (strengthScore / strengthCriteria.length) * 100;
  
  const getStrengthColor = (score: number): string => {
    if (score <= 2) return "bg-red-500";
    if (score <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-4">
      <div className="h-2 w-full bg-gray-200/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="space-y-2">
        {strengthCriteria.map((criteria, index) => {
          const isMet = criteria.regex.test(password);
          return (
            <div key={index} className="flex items-center text-sm text-gray-300">
              {isMet ? (
                <Shield className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <Shield className="h-5 w-5 text-red-500 mr-2" />
              )}
              <span>{criteria.description}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrength;
