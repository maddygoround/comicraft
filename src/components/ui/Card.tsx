import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`glass rounded-2xl border border-white/10 p-6 ${className}`}>
      {children}
    </div>
  );
};
