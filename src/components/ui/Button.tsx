import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#C2E2FA] to-[#B7A3E3] hover:from-[#C2E2FA]/80 hover:to-[#B7A3E3]/80 text-gray-800',
    secondary: 'bg-gradient-to-r from-[#B7A3E3] to-[#FF8F8F] hover:from-[#B7A3E3]/80 hover:to-[#FF8F8F]/80 text-white',
    outline: 'glass border-2 border-[#B7A3E3]/50 hover:border-[#B7A3E3] text-[#B7A3E3] hover:text-white hover:bg-[#B7A3E3]/10'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
