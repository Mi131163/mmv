import React from 'react';

const variantClasses: Record<string, string> = {
  // Status
  active:    'bg-success-bg text-success',
  ongoing:   'bg-success-bg text-success',
  won:       'bg-success-bg text-success',
  pending:   'bg-warning-bg text-warning',
  draft:     'bg-warning-bg text-warning',
  inactive:  'bg-neutral-bg text-neutral',
  past:      'bg-neutral-bg text-neutral',
  closed:    'bg-neutral-bg text-neutral',
  overdue:   'bg-danger-bg text-danger',
  rejected:  'bg-danger-bg text-danger',
  lost:      'bg-danger-bg text-danger',
  // Donor type
  philanthropic: 'bg-card-rose text-accent',
  government:    'bg-neutral-bg text-[#404040]',
  multilateral:  'bg-neutral-bg text-[#404040]',
  bilateral:     'bg-neutral-bg text-[#404040]',
  corporate:     'bg-neutral-bg text-neutral',
  // Opportunity stage
  prospect:        'bg-neutral-bg text-neutral',
  'due-diligence': 'bg-warning-bg text-warning',
  'due diligence': 'bg-warning-bg text-warning',
  review:          'bg-card-mist text-[#4A3570]',
  // Task type
  task:      'bg-neutral-bg text-neutral',
  milestone: 'bg-neutral-bg text-[#404040]',
  report:    'bg-accent-subtle text-accent',
  // Engagement type
  meeting:    'bg-neutral-bg text-[#404040]',
  call:       'bg-neutral-bg text-neutral',
  'site-visit': 'bg-neutral-bg text-[#404040]',
  'site visit': 'bg-neutral-bg text-[#404040]',
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
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-[0.02em] whitespace-nowrap ${classes} ${className}`}
    >
      {children}
    </span>
  );
}
