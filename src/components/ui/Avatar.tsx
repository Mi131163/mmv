interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ initials, size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-[11px]',
    md: 'w-8 h-8 text-[12px]',
    lg: 'w-12 h-12 text-[16px]',
  };
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-neutral-bg text-text-secondary font-bold flex-shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {initials}
    </div>
  );
}
