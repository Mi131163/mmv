import React from 'react';

const variantClasses: Record<string, string> = {
  active: 'bg-success-bg text-success',
  ongoing: 'bg-success-bg text-success',
  won: 'bg-success-bg text-success',
  pending: 'bg-warning-bg text-warning',
  draft: 'bg-warning-bg text-warning',
  inactive: 'bg-neutral-bg text-neutral',
  past: 'bg-neutral-bg text-neutral',
  closed: 'bg-neutral-bg text-neutral',
  overdue: 'bg-danger-bg text-danger',
  rejected: 'bg-danger-bg text-danger',
  lost: 'bg-danger-bg text-danger',
  philanthropic: 'bg-card-rose text-accent',
  government: 'bg-card-mist text-[#4A3570]',
  multilateral: 'bg-card-sand text-[#7A5C1E]',
  bilateral: 'bg-card-mist text-[#4A3570]',
  corporate: 'bg-neutral-bg text-neutral',
  prospect: 'bg-neutral-bg text-neutral',
  'due-diligence': 'bg-warning-bg text-warning',
  'due diligence': 'bg-warning-bg text-warning',
  review: 'bg-card-mist text-[#4A3570]',
  task: 'bg-neutral-bg text-neutral',
  milestone: 'bg-card-mist text-[#4A3570]',
  report: 'bg-card-sand text-[#7A5C1E]',
  meeting: 'bg-accent-subtle text-accent',
  call: 'bg-neutral-bg text-neutral',
  'site-visit': 'bg-card-mist text-[#4A3570]',
  'site visit': 'bg-card-mist text-[#4A3570]',
};

interface BadgeProps {
  variant: string;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  const key = variant.toLowerCase();
  const classes = variantClasses[key] ?? 'bg-neutral-bg text-neutral';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium tracking-[0.01em] whitespace-nowrap ${classes} ${className}`}
    >
      {children}
    </span>
  );
}
