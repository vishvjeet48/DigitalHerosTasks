import { useMemo, useState } from 'react';
import { Copy, Check, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { Lead, StatusOption } from '../../types/lead';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { TableSkeleton } from '../ui/Skeleton';
import { formatDate, truncateText } from '../../utils/formatDate';
import { STATUS_OPTIONS } from '../../types/lead';

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  onStatusChange: (id: string, status: StatusOption) => Promise<void>;
}

type SortKey = 'name' | 'budget' | 'createdAt';
type SortDir = 'asc' | 'desc';

const AVATAR_TONES = [
  'bg-primary-100 text-primary-700',
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
];

const toneForName = (name: string) => {
  const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_TONES[hash % AVATAR_TONES.length];
};

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export const LeadsTable = ({ leads, isLoading, onStatusChange }: LeadsTableProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const copyEmail = async (email: string, id: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedId(id);
      toast.success('Email copied to clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Failed to copy email');
    }
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
      return;
    }
    setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const sortedLeads = useMemo(() => {
    if (!sortKey) return leads;
    const sorted = [...leads].sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name);
      if (sortKey === 'budget') return Number(a.budget) - Number(b.budget);
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    return sortDir === 'asc' ? sorted : sorted.reverse();
  }, [leads, sortKey, sortDir]);

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-400" aria-hidden="true" />;
    }
    return sortDir === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
    );
  };

  const sortableHeader = (label: string, key: SortKey) => (
    <button
      type="button"
      onClick={() => toggleSort(key)}
      className="group flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 transition-colors hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 rounded"
      aria-label={`Sort by ${label}`}
    >
      {label}
      <SortIcon column={key} />
    </button>
  );

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <TableSkeleton />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          <caption className="sr-only">List of leads with contact details and status</caption>
          <thead className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur-sm">
            <tr className="border-b border-gray-200">
              <th scope="col" className="px-6 py-3.5 text-left">
                {sortableHeader('Name', 'name')}
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                {sortableHeader('Budget', 'budget')}
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Message
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th scope="col" className="px-6 py-3.5 text-left">
                {sortableHeader('Created', 'createdAt')}
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Update status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedLeads.map((lead) => (
              <tr key={lead._id} className="group transition-colors hover:bg-gray-50/80 animate-fade-in">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${toneForName(lead.name)}`}
                      aria-hidden="true"
                    >
                      {initials(lead.name)}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{lead.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>{lead.email}</span>
                    <button
                      onClick={() => copyEmail(lead.email, lead._id)}
                      aria-label={`Copy email address for ${lead.name}`}
                      title="Copy email"
                      className="rounded-md p-1 text-gray-400 opacity-0 transition-all hover:bg-gray-100 hover:text-primary-600 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 group-hover:opacity-100"
                    >
                      {copiedId === lead._id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm tabular-nums text-gray-600">
                  {lead.budget}
                </td>
                <td className="max-w-xs px-6 py-4 text-sm text-gray-600">
                  <span title={lead.message}>{truncateText(lead.message, 50)}</span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Badge status={lead.status} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {formatDate(lead.createdAt)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <select
                    value={lead.status}
                    onChange={(e) => onStatusChange(lead._id, e.target.value as StatusOption)}
                    aria-label={`Change status for ${lead.name}`}
                    className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-700 transition-all hover:border-gray-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};