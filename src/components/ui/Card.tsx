import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-bg-surface rounded-[10px] border border-border-subtle ${onClick ? 'cursor-pointer hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
