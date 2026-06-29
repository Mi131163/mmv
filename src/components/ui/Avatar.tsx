interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ initials, size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-[11px]',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-lg',
  };
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-accent-subtle text-accent font-semibold flex-shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {initials}
    </div>
  );
}
