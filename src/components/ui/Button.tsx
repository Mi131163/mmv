import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center gap-1.5 font-medium rounded-[8px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 cursor-pointer';
  const sizeClass = size === 'sm' ? 'h-8 px-3 text-[13px]' : 'h-9 px-4 text-[14px]';
  const variantClass = {
    primary: 'bg-accent text-white hover:bg-accent-hover',
    ghost: 'bg-transparent border border-border-default text-text-secondary hover:bg-bg-hover',
    destructive: 'bg-danger text-white hover:opacity-90',
  }[variant];

  return (
    <button className={`${base} ${sizeClass} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
