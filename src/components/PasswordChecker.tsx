
import React, { useState } from 'react';
import { Eye, EyeOff, Shield, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import MatrixBackground from './MatrixBackground';
import PasswordStrength, { strengthCriteria } from './PasswordStrength';

// Common passwords list
const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome'];

const PasswordChecker = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const getStrengthScore = (pwd: string): number => {
    return strengthCriteria.filter(criteria => criteria.regex.test(pwd)).length;
  };

  const generatePassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    const newPassword = Array.from({ length }, () => 
      charset.charAt(Math.floor(Math.random() * charset.length))
    ).join('');
    
    setPassword(newPassword);
    toast({
      title: "Password Generated",
      description: "A strong password has been generated!",
    });
  };

  const copyToClipboard = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      toast({
        title: "Copied!",
        description: "Password copied to clipboard",
      });
    }
  };

  const estimateCrackTime = (pwd: string): string => {
    const combinations = Math.pow(95, pwd.length);
    const guessesPerSecond = 1000000000;
    const seconds = combinations / guessesPerSecond;
    
    if (seconds < 60) return 'less than a minute';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' minutes';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours';
    if (seconds < 31536000) return Math.floor(seconds / 86400) + ' days';
    return Math.floor(seconds / 31536000) + ' years';
  };

  const strengthScore = getStrengthScore(password);

  return (
    <>
      <MatrixBackground />
      <div className="relative z-10 max-w-md w-full space-y-8 bg-black/20 backdrop-blur-lg p-8 rounded-lg shadow-lg border border-white/10">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-purple-500 animate-pulse" />
          <h2 className="mt-6 text-3xl font-bold text-white">Password Checker</h2>
          <p className="mt-2 text-sm text-gray-400">
            Check how strong your password is
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border-white/10 text-white"
              placeholder="Enter your password"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={generatePassword}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              Generate Password
            </Button>
            <Button
              onClick={copyToClipboard}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              disabled={!password}
            >
              <Copy className="mr-2" size={16} />
              Copy
            </Button>
          </div>

          <PasswordStrength password={password} strengthScore={strengthScore} />

          {password && (
            <div className="space-y-2">
              <div className="text-sm p-2 rounded bg-white/5 text-gray-300">
                Time to crack: {estimateCrackTime(password)}
              </div>
              
              {commonPasswords.includes(password.toLowerCase()) && (
                <div className="text-sm p-2 rounded bg-red-500/20 text-red-300">
                  Warning: This is a commonly used password!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PasswordChecker;
