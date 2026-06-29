import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { donors, allRMs } from '../data/mockData';
import type { Donor, DonorStatus, DonorType } from '../types';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getDaysUntil(dateStr: string) {
  return (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
}

function getDeadlineColorClass(dateStr: string | undefined, isOverdue: boolean) {
  if (isOverdue) return 'text-danger';
  if (!dateStr) return 'text-text-tertiary';
  const diff = getDaysUntil(dateStr);
  if (diff < 0) return 'text-danger';
  if (diff < 30) return 'text-warning';
  return 'text-text-secondary';
}

function getDonorInitials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /[A-Za-z]/.test(w[0] ?? ''))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

const STATUS_OPTIONS: DonorStatus[] = ['Active', 'Inactive', 'Past'];
const TYPE_OPTIONS: DonorType[] = [
  'Philanthropic',
  'Government',
  'Bilateral',
  'Multilateral',
  'Corporate',
];

type SortKey = 'name' | 'type' | 'status' | 'totalAwarded' | 'nextDeadline';
type SortDir = 'asc' | 'desc';

export function DonorsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<DonorStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<DonorType | 'All'>('All');
  const [rmFilter, setRmFilter] = useState<string>('All');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const filtered = donors
    .filter((d) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !d.name.toLowerCase().includes(q) &&
          !d.shortName.toLowerCase().includes(q) &&
          !d.type.toLowerCase().includes(q)
        )
          return false;
      }
      if (statusFilter !== 'All' && d.status !== statusFilter) return false;
      if (typeFilter !== 'All' && d.type !== typeFilter) return false;
      if (rmFilter !== 'All' && d.assignedRM.id !== rmFilter) return false;
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'type':
          cmp = a.type.localeCompare(b.type);
          break;
        case 'status':
          cmp = a.status.localeCompare(b.status);
          break;
        case 'totalAwarded':
          cmp = a.totalAwarded - b.totalAwarded;
          break;
        case 'nextDeadline':
          if (!a.nextDeadline && !b.nextDeadline) cmp = 0;
          else if (!a.nextDeadline) cmp = 1;
          else if (!b.nextDeadline) cmp = -1;
          else
            cmp =
              new Date(a.nextDeadline.date).getTime() - new Date(b.nextDeadline.date).getTime();
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp size={12} className="text-text-tertiary opacity-40" />;
    return sortDir === 'asc' ? (
      <ChevronUp size={12} className="text-accent" />
    ) : (
      <ChevronDown size={12} className="text-accent" />
    );
  }

  function ColHeader({
    col,
    label,
    className = '',
  }: {
    col: SortKey;
    label: string;
    className?: string;
  }) {
    return (
      <th
        className={`py-2.5 px-3 text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.04em] cursor-pointer hover:text-text-primary transition-colors whitespace-nowrap ${className}`}
        onClick={() => handleSort(col)}
      >
        <span className="inline-flex items-center gap-1">
          {label} <SortIcon col={col} />
        </span>
      </th>
    );
  }

  const hasFilters =
    statusFilter !== 'All' || typeFilter !== 'All' || rmFilter !== 'All' || search !== '';

  return (
    <div className="max-w-[1160px] space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-text-primary">Donors</h1>
          <p className="text-[13px] text-text-tertiary mt-0.5">
            {donors.length} donors · {donors.filter((d) => d.status === 'Active').length} active
          </p>
        </div>
        <Button size="sm">
          <Plus size={14} />
          New donor
        </Button>
      </div>

      {/* Filters bar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search donors…"
            className="h-8 pl-8 pr-3 w-[220px] bg-bg-surface border border-border-default rounded-lg text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setStatusFilter('All')}
            className={`h-8 px-3 rounded-lg text-[13px] font-medium transition-colors border ${
              statusFilter === 'All'
                ? 'bg-accent text-white border-accent'
                : 'bg-bg-surface border-border-default text-text-secondary hover:bg-bg-hover'
            }`}
          >
            All status
          </button>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? 'All' : s)}
              className={`h-8 px-3 rounded-lg text-[13px] font-medium transition-colors border ${
                statusFilter === s
                  ? 'bg-accent text-white border-accent'
                  : 'bg-bg-surface border-border-default text-text-secondary hover:bg-bg-hover'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-border-subtle" />

        {/* Type filter */}
        <div className="flex items-center gap-1 flex-wrap">
          {TYPE_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(typeFilter === t ? 'All' : t)}
              className={`h-8 px-3 rounded-lg text-[13px] font-medium transition-colors border ${
                typeFilter === t
                  ? 'bg-accent text-white border-accent'
                  : 'bg-bg-surface border-border-default text-text-secondary hover:bg-bg-hover'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-border-subtle" />

        {/* RM filter */}
        <select
          value={rmFilter}
          onChange={(e) => setRmFilter(e.target.value)}
          className="h-8 px-3 pr-6 bg-bg-surface border border-border-default rounded-lg text-[13px] text-text-secondary focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
        >
          <option value="All">All RMs</option>
          {allRMs.map((rm) => (
            <option key={rm.id} value={rm.id}>
              {rm.name}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('All');
              setTypeFilter('All');
              setRmFilter('All');
            }}
            className="h-8 px-3 text-[13px] text-accent hover:text-accent-hover transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-bg-surface rounded-[10px] border border-border-subtle overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-full bg-neutral-bg flex items-center justify-center mb-4">
              <Search size={20} className="text-neutral" />
            </div>
            <p className="text-[15px] font-medium text-text-primary">No donors found</p>
            <p className="text-[13px] text-text-tertiary mt-1">
              Try adjusting your search or filters
            </p>
            {hasFilters && (
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('All');
                  setTypeFilter('All');
                  setRmFilter('All');
                }}
                className="mt-4 text-[13px] text-accent hover:text-accent-hover transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle bg-bg-page">
                  <ColHeader col="name" label="Donor" className="pl-5" />
                  <ColHeader col="type" label="Type" />
                  <ColHeader col="status" label="Status" />
                  <th className="py-2.5 px-3 text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.04em] whitespace-nowrap">
                    Assigned RM
                  </th>
                  <ColHeader col="totalAwarded" label="Total awarded" />
                  <ColHeader col="nextDeadline" label="Next deadline" />
                  <th className="py-2.5 px-3 text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.04em]">
                    Grants / Opps
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((donor: Donor) => {
                  const initials = getDonorInitials(donor.name);
                  const deadlineColor = donor.nextDeadline
                    ? getDeadlineColorClass(donor.nextDeadline.date, donor.overdueCount > 0)
                    : 'text-text-tertiary';

                  return (
                    <tr
                      key={donor.id}
                      onClick={() => navigate(`/donors/${donor.id}`)}
                      className="border-b border-border-subtle last:border-0 hover:bg-bg-hover cursor-pointer transition-colors"
                    >
                      {/* Donor name */}
                      <td className="py-3.5 px-3 pl-5">
                        <div className="flex items-center gap-3">
                          <Avatar initials={initials} size="sm" />
                          <div className="min-w-0">
                            <p className="text-[14px] font-medium text-text-primary truncate max-w-[220px]">
                              {donor.name}
                            </p>
                            {donor.overdueCount > 0 && (
                              <Badge variant="overdue" className="mt-0.5">
                                {donor.overdueCount} overdue
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-3">
                        <Badge variant={donor.type.toLowerCase()}>{donor.type}</Badge>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <Badge variant={donor.status.toLowerCase()}>{donor.status}</Badge>
                      </td>

                      {/* Assigned RM */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <Avatar initials={donor.assignedRM.initials} size="sm" />
                          <span className="text-[13px] text-text-secondary">
                            {donor.assignedRM.name}
                          </span>
                        </div>
                      </td>

                      {/* Total awarded */}
                      <td className="py-3.5 px-3">
                        <span className="text-[14px] font-medium text-text-primary">
                          €{donor.totalAwarded.toFixed(1)}M
                        </span>
                        <p className="text-[11px] text-text-tertiary">
                          €{donor.remainingBalance.toFixed(1)}M remaining
                        </p>
                      </td>

                      {/* Next deadline */}
                      <td className="py-3.5 px-3">
                        {donor.nextDeadline ? (
                          <div>
                            <p className={`text-[13px] font-medium ${deadlineColor}`}>
                              {formatDate(donor.nextDeadline.date)}
                            </p>
                            <p className="text-[11px] text-text-tertiary">
                              {donor.nextDeadline.type}
                            </p>
                          </div>
                        ) : (
                          <span className="text-[13px] text-text-tertiary">—</span>
                        )}
                      </td>

                      {/* Grants / Opps */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2 text-[12px] text-text-tertiary">
                          <span className="bg-success-bg text-success px-2 py-0.5 rounded-full font-medium">
                            {donor.activeGrants}g
                          </span>
                          <span className="bg-card-mist text-[#4A3570] px-2 py-0.5 rounded-full font-medium">
                            {donor.activeOpportunities}o
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-[12px] text-text-tertiary">
        Showing {filtered.length} of {donors.length} donors
      </p>
    </div>
  );
}
