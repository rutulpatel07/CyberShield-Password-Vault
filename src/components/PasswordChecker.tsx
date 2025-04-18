
import React, { useState } from 'react';
import { Eye, EyeOff, Check, X, Shield } from 'lucide-react';

interface StrengthCriteria {
  regex: RegExp;
  description: string;
}

const strengthCriteria: StrengthCriteria[] = [
  { regex: /.{8,}/, description: "At least 8 characters long" },
  { regex: /[A-Z]/, description: "Contains uppercase letter" },
  { regex: /[a-z]/, description: "Contains lowercase letter" },
  { regex: /[0-9]/, description: "Contains number" },
  { regex: /[^A-Za-z0-9]/, description: "Contains special character" },
];

const PasswordChecker = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const getStrengthScore = (password: string): number => {
    return strengthCriteria.filter(criteria => criteria.regex.test(password)).length;
  };

  const getStrengthColor = (score: number): string => {
    if (score <= 2) return "bg-red-500";
    if (score <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const strengthScore = getStrengthScore(password);
  const percentage = (strengthScore / strengthCriteria.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-purple-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Password Checker</h2>
          <p className="mt-2 text-sm text-gray-600">
            Check how strong your password is
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your password"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="space-y-4">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>

            <div className="space-y-2">
              {strengthCriteria.map((criteria, index) => (
                <div key={index} className="flex items-center text-sm">
                  {criteria.regex.test(password) ? (
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className="text-gray-600">{criteria.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordChecker;
