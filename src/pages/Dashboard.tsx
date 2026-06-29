import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { RevenueChart } from '../components/charts/RevenueChart';
import { donors, todoItems } from '../data/mockData';
import type { RevenueYear } from '../types';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
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
  return 'text-success';
}

function getDonorInitials(name: string) {
  return name
    .split(' ')
    .filter((w) => /[A-Z]/.test(w[0] ?? ''))
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
}

export function Dashboard() {
  const today = new Date();
  const dayName = today.toLocaleDateString('en-GB', { weekday: 'long' });
  const dateStr = today.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const activeDonors = donors.filter((d) => d.status === 'Active');
  const myDonors = donors.filter((d) => d.assignedRM.id === 'rm-1');

  const allOpps = donors.flatMap((d) => d.opportunities);
  const pipelineStages = ['Prospect', 'Due diligence', 'Draft', 'Review'];
  const stageCounts = pipelineStages.map((stage) => ({
    stage,
    count: allOpps.filter((o) => o.stage === stage).length,
  }));

  const nextEngagementDonor = donors.find(
    (d) => d.nextEngagement && d.assignedRM.id === 'rm-1',
  );

  // Aggregate revenue across my donors
  const allRevenueData = myDonors
    .reduce<RevenueYear[]>((acc, donor) => {
      donor.revenueByYear.forEach((yr) => {
        const existing = acc.find((r) => r.year === yr.year);
        if (existing) {
          existing.confirmed += yr.confirmed;
          existing.weighted += yr.weighted;
        } else {
          acc.push({ ...yr });
        }
      });
      return acc;
    }, [])
    .sort((a, b) => a.year - b.year);

  return (
    <div className="max-w-[1160px] space-y-7">
      {/* Page header */}
      <div>
        <h1 className="text-[24px] font-semibold text-text-primary">Good morning, Sarah</h1>
        <p className="text-[14px] text-text-tertiary mt-1">
          {dayName}, {dateStr}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <Link
          to="/opportunities"
          className="block p-5 rounded-[10px] bg-card-mist border border-border-subtle hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-shadow"
        >
          <div className="text-[32px] font-semibold text-text-primary leading-none">
            {allOpps.filter((o) => o.stage === 'Due diligence').length}
          </div>
          <div className="text-[12px] font-medium text-text-tertiary mt-2 uppercase tracking-[0.04em]">
            Due diligence opportunities
          </div>
        </Link>
        <Link
          to="/grants"
          className="block p-5 rounded-[10px] bg-card-sand border border-border-subtle hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-shadow"
        >
          <div className="text-[32px] font-semibold text-text-primary leading-none">
            {donors.flatMap((d) => d.grants).filter((g) => g.status === 'Ongoing').length}
          </div>
          <div className="text-[12px] font-medium text-text-tertiary mt-2 uppercase tracking-[0.04em]">
            Active grants
          </div>
        </Link>
        <Link
          to="/donors"
          className="block p-5 rounded-[10px] bg-card-rose border border-border-subtle hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-shadow"
        >
          <div className="text-[32px] font-semibold text-text-primary leading-none">
            {activeDonors.length}
          </div>
          <div className="text-[12px] font-medium text-text-tertiary mt-2 uppercase tracking-[0.04em]">
            Active donors
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6">
        {/* Left column */}
        <div className="space-y-6 min-w-0">
          {/* To do this week */}
          <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-semibold text-text-primary">To do this week</h2>
              <Link to="/deliverables" className="text-[13px] text-accent hover:text-accent-hover transition-colors">
                View all
              </Link>
            </div>
            <div className="space-y-0">
              {todoItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 py-2.5 border-b border-border-subtle last:border-0 hover:bg-bg-hover -mx-2 px-2 rounded-lg transition-colors cursor-default"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.isOverdue ? 'bg-danger' : 'bg-warning'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] text-text-primary truncate block">{item.name}</span>
                  </div>
                  <Badge variant={item.type}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </Badge>
                  <span className="text-[12px] text-text-tertiary hidden md:block truncate max-w-[120px]">
                    {item.donorName}
                  </span>
                  <span
                    className={`text-[12px] whitespace-nowrap flex-shrink-0 ${item.isOverdue ? 'text-danger font-medium' : 'text-text-secondary'}`}
                  >
                    {item.isOverdue ? 'Overdue' : formatDate(item.dueDate)}
                  </span>
                  <input
                    type="checkbox"
                    className="flex-shrink-0 w-4 h-4 rounded accent-[#610042] cursor-pointer"
                    aria-label={`Complete: ${item.name}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* My donors */}
          <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-semibold text-text-primary">My donors</h2>
              <Link to="/donors" className="text-[13px] text-accent hover:text-accent-hover transition-colors">
                View all
              </Link>
            </div>
            <div>
              {myDonors.map((donor) => {
                const deadlineColor = donor.nextDeadline
                  ? getDeadlineColorClass(donor.nextDeadline.date, donor.overdueCount > 0)
                  : 'text-text-tertiary';
                const initials = getDonorInitials(donor.name);

                return (
                  <Link
                    key={donor.id}
                    to={`/donors/${donor.id}`}
                    className="flex items-center gap-3 py-3 border-b border-border-subtle last:border-0 hover:bg-bg-hover -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <Avatar initials={initials} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[14px] font-medium text-text-primary truncate">
                          {donor.name}
                        </span>
                        <Badge variant={donor.type.toLowerCase()}>{donor.type}</Badge>
                        {donor.overdueCount > 0 && (
                          <Badge variant="overdue">{donor.overdueCount} overdue</Badge>
                        )}
                      </div>
                      <div className={`text-[12px] mt-0.5 ${deadlineColor}`}>
                        {donor.nextDeadline
                          ? `${donor.nextDeadline.type} · ${formatDate(donor.nextDeadline.date)}`
                          : 'No upcoming deadlines'}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[12px] text-text-tertiary flex-shrink-0">
                      <span>
                        {donor.activeOpportunities} opp
                        {donor.activeOpportunities !== 1 ? 's' : ''}
                      </span>
                      <span>
                        {donor.activeGrants} grant{donor.activeGrants !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Pipeline */}
          <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-semibold text-text-primary">Pipeline</h2>
              <Link to="/opportunities" className="text-[13px] text-accent hover:text-accent-hover transition-colors">
                View all
              </Link>
            </div>
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {stageCounts.map(({ stage, count }) => (
                <div
                  key={stage}
                  className="flex items-center gap-2 px-3 py-1.5 bg-bg-page rounded-lg border border-border-subtle"
                >
                  <span className="text-[12px] text-text-secondary">{stage}</span>
                  <span className="text-[15px] font-semibold text-text-primary">{count}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-subtle rounded-lg border border-accent-border ml-auto">
                <span className="text-[12px] text-accent font-medium">
                  Total weighted:{' '}
                  €{allRevenueData.reduce((s, r) => s + r.weighted, 0).toFixed(1)}M
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-[13px] font-medium text-text-secondary mb-4">
                Revenue by year — my portfolio
              </h3>
              <RevenueChart data={allRevenueData} />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Next engagement */}
          {nextEngagementDonor?.nextEngagement && (
            <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-5">
              <h2 className="text-[15px] font-semibold text-text-primary mb-4">
                Next engagement
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-text-tertiary flex-shrink-0" />
                  <span className="text-[13px] text-text-primary">
                    {new Date(nextEngagementDonor.nextEngagement.date).toLocaleDateString(
                      'en-GB',
                      { weekday: 'short', day: 'numeric', month: 'long' },
                    )}
                    {' · '}
                    {new Date(nextEngagementDonor.nextEngagement.date).toLocaleTimeString(
                      'en-GB',
                      { hour: '2-digit', minute: '2-digit' },
                    )}
                  </span>
                </div>
                <div>
                  <Badge variant={nextEngagementDonor.nextEngagement.type.toLowerCase()}>
                    {nextEngagementDonor.nextEngagement.type}
                  </Badge>
                </div>
                <Link
                  to={`/donors/${nextEngagementDonor.id}`}
                  className="flex items-center gap-1.5 text-[14px] font-medium text-accent hover:text-accent-hover transition-colors"
                >
                  {nextEngagementDonor.name}
                </Link>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  {nextEngagementDonor.nextEngagement.notes}
                </p>
                {nextEngagementDonor.nextEngagement.linkedEntity && (
                  <div className="text-[12px] text-text-tertiary bg-bg-page rounded-lg px-3 py-2 border border-border-subtle">
                    Linked: {nextEngagementDonor.nextEngagement.linkedEntity}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Overdue alerts */}
          {donors.filter((d) => d.overdueCount > 0).length > 0 && (
            <div className="bg-danger-bg rounded-[10px] border border-danger/20 p-4">
              <h3 className="text-[13px] font-semibold text-danger mb-2">Overdue items</h3>
              {donors
                .filter((d) => d.overdueCount > 0)
                .map((donor) => (
                  <Link
                    key={donor.id}
                    to={`/donors/${donor.id}`}
                    className="flex items-center justify-between py-2 hover:opacity-80 transition-opacity"
                  >
                    <span className="text-[13px] text-danger">{donor.shortName}</span>
                    <span className="text-[12px] text-danger font-medium">
                      {donor.overdueCount} overdue
                    </span>
                  </Link>
                ))}
            </div>
          )}

          {/* Upcoming deadlines */}
          <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-5">
            <h2 className="text-[15px] font-semibold text-text-primary mb-3">
              Upcoming deadlines
            </h2>
            <div className="space-y-0">
              {donors
                .filter((d) => d.nextDeadline)
                .sort(
                  (a, b) =>
                    new Date(a.nextDeadline!.date).getTime() -
                    new Date(b.nextDeadline!.date).getTime(),
                )
                .slice(0, 5)
                .map((donor) => {
                  const diff = getDaysUntil(donor.nextDeadline!.date);
                  const colorClass =
                    diff < 0
                      ? 'text-danger'
                      : diff < 30
                        ? 'text-warning'
                        : 'text-text-secondary';
                  return (
                    <Link
                      key={donor.id}
                      to={`/donors/${donor.id}`}
                      className="flex items-center justify-between py-2.5 border-b border-border-subtle last:border-0 hover:bg-bg-hover -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-text-primary truncate">
                          {donor.shortName}
                        </p>
                        <p className="text-[12px] text-text-tertiary">
                          {donor.nextDeadline!.type}
                        </p>
                      </div>
                      <span className={`text-[12px] font-medium flex-shrink-0 ml-2 ${colorClass}`}>
                        {diff < 0
                          ? 'Overdue'
                          : diff < 1
                            ? 'Today'
                            : `${Math.ceil(diff)}d`}
                      </span>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
