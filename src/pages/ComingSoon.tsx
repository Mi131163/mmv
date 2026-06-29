import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-accent-subtle flex items-center justify-center mb-6">
        <span className="text-accent font-bold text-[20px]">MMV</span>
      </div>
      <h2 className="text-[20px] font-semibold text-text-primary mb-2">{title}</h2>
      <p className="text-[28px] font-semibold text-text-primary mt-4 leading-tight">
        This section is coming soon.
      </p>
      <p className="text-[14px] text-text-secondary mt-4 max-w-md leading-relaxed">
        {description}
      </p>
      <Link
        to="/"
        className="mt-8 flex items-center gap-2 text-[14px] text-accent hover:text-accent-hover transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </Link>
    </div>
  );
}
