import { StatusOption } from '../../types/lead';

interface BadgeProps {
  status: StatusOption;
}

const statusStyles: Record<StatusOption, { badge: string; dot: string }> = {
  New: {
    badge: 'bg-cyan-50 text-cyan-700 border border-cyan-200/60',
    dot: 'bg-cyan-500 animate-pulse',
  },
  Contacted: {
    badge: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    dot: 'bg-amber-500',
  },
  Closed: {
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    dot: 'bg-emerald-500',
  },
};

export const Badge = ({ status }: BadgeProps) => {
  const style = statusStyles[status] || statusStyles.New;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {status}
    </span>
  );
};

