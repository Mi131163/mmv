import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  MapPin,
  ExternalLink,
  Plus,
  Calendar,
  FileText,
  Users,
  TrendingUp,
  Layers,
  Activity,
  Star,
  PhoneCall,
  Video,
  Upload,
  CheckCircle,
  DollarSign,
  UserPlus,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { RevenueChart } from '../components/charts/RevenueChart';
import { donors } from '../data/mockData';
import type { Grant, Opportunity, Contact, Engagement, Document, ActivityEntry } from '../types';

type Tab =
  | '360'
  | 'About'
  | 'Contacts'
  | 'Engagements'
  | 'Opportunities'
  | 'Grants'
  | 'Documents'
  | 'Activity';

const TABS: Tab[] = [
  '360',
  'About',
  'Contacts',
  'Engagements',
  'Opportunities',
  'Grants',
  'Documents',
  'Activity',
];

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  );
}

function getDaysUntil(dateStr: string) {
  return (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
}

function DeadlineChip({ date, label }: { date: string; label?: string }) {
  const diff = getDaysUntil(date);
  const colorClass =
    diff < 0 ? 'text-danger bg-danger-bg' : diff < 30 ? 'text-warning bg-warning-bg' : 'text-success bg-success-bg';
  const suffix = diff < 0 ? 'Overdue' : diff < 1 ? 'Today' : `${Math.ceil(diff)}d`;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-medium ${colorClass}`}>
      {label && <span className="opacity-70">{label} ·</span>}
      {suffix}
    </span>
  );
}

function FileTypeIcon({ type }: { type: string }) {
  const colors: Record<string, string> = {
    pdf: 'bg-danger-bg text-danger',
    docx: 'bg-card-mist text-[#4A3570]',
    xlsx: 'bg-success-bg text-success',
    pptx: 'bg-warning-bg text-warning',
  };
  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-[10px] font-bold uppercase flex-shrink-0 ${colors[type] ?? 'bg-neutral-bg text-neutral'}`}
    >
      {type}
    </span>
  );
}

function ActivityIcon({ type }: { type: ActivityEntry['actionType'] }) {
  const icons: Record<ActivityEntry['actionType'], React.ReactNode> = {
    'stage-change': <TrendingUp size={14} />,
    'document-upload': <Upload size={14} />,
    'task-completed': <CheckCircle size={14} />,
    'grant-created': <DollarSign size={14} />,
    'contact-added': <UserPlus size={14} />,
    'engagement-logged': <MessageSquare size={14} />,
    'financial-update': <DollarSign size={14} />,
  };
  return (
    <div className="w-7 h-7 rounded-full bg-accent-subtle text-accent flex items-center justify-center flex-shrink-0">
      {icons[type]}
    </div>
  );
}

function EngagementTypeIcon({ type }: { type: string }) {
  if (type === 'Meeting') return <Video size={14} className="text-accent" />;
  if (type === 'Call') return <PhoneCall size={14} className="text-neutral" />;
  return <MapPin size={14} className="text-[#4A3570]" />;
}

// ---- Tab Components ----

function Tab360({ donor }: { donor: (typeof donors)[0] }) {
  const ongoingGrants = donor.grants.filter((g) => g.status === 'Ongoing');
  const closedGrants = donor.grants.filter((g) => g.status === 'Closed');
  const consumedPct =
    donor.totalAwarded > 0 ? Math.round((donor.consumed / donor.totalAwarded) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Relationship health strip */}
      <div className="grid grid-cols-2 gap-4">
        {/* Next deadline */}
        <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-4">
          <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.04em] mb-2">
            Next deadline
          </p>
          {donor.nextDeadline ? (
            <>
              <p className="text-[15px] font-semibold text-text-primary">{donor.nextDeadline.type}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[13px] text-text-secondary">{formatDate(donor.nextDeadline.date)}</p>
                <DeadlineChip date={donor.nextDeadline.date} />
              </div>
            </>
          ) : (
            <p className="text-[14px] text-text-tertiary">No upcoming deadlines</p>
          )}
        </div>

        {/* Overdue */}
        <div
          className={`rounded-[10px] border p-4 ${donor.overdueCount > 0 ? 'bg-danger-bg border-danger/20' : 'bg-bg-surface border-border-subtle'}`}
        >
          <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.04em] mb-2">
            Overdue items
          </p>
          <p
            className={`text-[32px] font-semibold leading-none ${donor.overdueCount > 0 ? 'text-danger' : 'text-success'}`}
          >
            {donor.overdueCount}
          </p>
          <p className="text-[13px] text-text-secondary mt-1">
            {donor.overdueCount === 0 ? 'All up to date' : 'Items need attention'}
          </p>
        </div>
      </div>

      {/* Grants & Opps summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-4">
          <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.04em] mb-1">
            Active grants
          </p>
          <p className="text-[28px] font-semibold text-text-primary leading-none">
            {ongoingGrants.length}
          </p>
          <p className="text-[12px] text-text-tertiary mt-1">{closedGrants.length} closed</p>
        </div>
        <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-4">
          <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.04em] mb-1">
            Active opportunities
          </p>
          <p className="text-[28px] font-semibold text-text-primary leading-none">
            {donor.activeOpportunities}
          </p>
          <p className="text-[12px] text-text-tertiary mt-1">
            {donor.opportunities.filter((o) => o.stage === 'Review').length} in review
          </p>
        </div>
        <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-4">
          <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.04em] mb-1">
            Reporting
          </p>
          <div className="space-y-1 mt-1">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${donor.mmvAnnualReport ? 'bg-success' : 'bg-neutral'}`}
              />
              <span className="text-[12px] text-text-secondary">MMV Annual Report</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${donor.pdpReport ? 'bg-success' : 'bg-neutral'}`}
              />
              <span className="text-[12px] text-text-secondary">PDP Report</span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget & Forecast */}
      <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-5">
        <h3 className="text-[15px] font-semibold text-text-primary mb-4">Budget & Forecast</h3>
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div>
            <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.04em]">
              Total awarded
            </p>
            <p className="text-[22px] font-semibold text-text-primary mt-0.5">
              €{donor.totalAwarded.toFixed(1)}M
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.04em]">
              Remaining balance
            </p>
            <p className="text-[22px] font-semibold text-success mt-0.5">
              €{donor.remainingBalance.toFixed(1)}M
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.04em]">
              Consumed
            </p>
            <p className="text-[22px] font-semibold text-text-primary mt-0.5">
              €{donor.consumed.toFixed(1)}M
            </p>
            <p className="text-[12px] text-text-tertiary">{consumedPct}% of total</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-neutral-bg rounded-full h-2 mb-5">
          <div
            className="bg-accent rounded-full h-2 transition-all"
            style={{ width: `${consumedPct}%` }}
          />
        </div>
        <h4 className="text-[13px] font-medium text-text-secondary mb-3">Revenue by year</h4>
        <RevenueChart data={donor.revenueByYear} />
      </div>

      {/* Next engagement */}
      {donor.nextEngagement && (
        <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-5">
          <h3 className="text-[15px] font-semibold text-text-primary mb-3">Next engagement</h3>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-subtle flex items-center justify-center flex-shrink-0">
              <EngagementTypeIcon type={donor.nextEngagement.type} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant={donor.nextEngagement.type.toLowerCase()}>
                  {donor.nextEngagement.type}
                </Badge>
                <span className="text-[13px] text-text-secondary">
                  {new Date(donor.nextEngagement.date).toLocaleDateString('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'long',
                  })}
                  {' · '}
                  {new Date(donor.nextEngagement.date).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-[13px] text-text-secondary mt-2 leading-relaxed">
                {donor.nextEngagement.notes}
              </p>
              {donor.nextEngagement.linkedEntity && (
                <p className="text-[12px] text-text-tertiary mt-1">
                  Linked: {donor.nextEngagement.linkedEntity}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent activity preview */}
      {donor.activity.length > 0 && (
        <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-5">
          <h3 className="text-[15px] font-semibold text-text-primary mb-4">Recent activity</h3>
          <div className="space-y-3">
            {donor.activity.slice(0, 4).map((entry) => (
              <div key={entry.id} className="flex items-start gap-3">
                <ActivityIcon type={entry.actionType} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-text-primary">{entry.description}</p>
                  <p className="text-[11px] text-text-tertiary mt-0.5">
                    {entry.actor} · {formatDateTime(entry.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TabAbout({ donor }: { donor: (typeof donors)[0] }) {
  const fields = [
    { label: 'Full name', value: donor.name },
    { label: 'Short name', value: donor.shortName },
    { label: 'Type', value: donor.type },
    { label: 'Status', value: donor.status },
    { label: 'Phone', value: donor.phone },
    { label: 'Email', value: donor.email, isEmail: true },
    { label: 'Website', value: donor.website, isLink: true },
    { label: 'Address', value: donor.address },
    { label: 'Assigned RM', value: donor.assignedRM.name },
    {
      label: 'MMV Annual Report',
      value: donor.mmvAnnualReport ? 'Yes' : 'No',
    },
    { label: 'PDP Report', value: donor.pdpReport ? 'Yes' : 'No' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[15px] font-semibold text-text-primary">Profile</h3>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {fields.map(({ label, value, isEmail, isLink }) => (
            <div key={label}>
              <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.04em] mb-0.5">
                {label}
              </p>
              {isEmail ? (
                <a
                  href={`mailto:${value}`}
                  className="text-[14px] text-accent hover:text-accent-hover transition-colors"
                >
                  {value}
                </a>
              ) : isLink ? (
                <a
                  href={`https://${value}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-1"
                >
                  {value}
                  <ExternalLink size={11} />
                </a>
              ) : (
                <p className="text-[14px] text-text-primary">{value}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-5">
        <h3 className="text-[15px] font-semibold text-text-primary mb-3">Notes</h3>
        <p className="text-[14px] text-text-secondary leading-relaxed">{donor.notes || '—'}</p>
      </div>
    </div>
  );
}

function TabContacts({ donor }: { donor: (typeof donors)[0] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-text-tertiary">{donor.contacts.length} contact{donor.contacts.length !== 1 ? 's' : ''}</p>
        <Button size="sm">
          <Plus size={14} />
          Add contact
        </Button>
      </div>

      {donor.contacts.length === 0 ? (
        <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-10 text-center">
          <Users size={24} className="text-text-tertiary mx-auto mb-3" />
          <p className="text-[14px] text-text-primary font-medium">No contacts yet</p>
          <p className="text-[13px] text-text-tertiary mt-1">Add a contact to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {donor.contacts.map((contact: Contact) => (
            <div
              key={contact.id}
              className="bg-bg-surface rounded-[10px] border border-border-subtle p-4"
            >
              <div className="flex items-start gap-4">
                <Avatar initials={contact.name.split(' ').slice(0, 2).map((w) => w[0]).join('')} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[15px] font-semibold text-text-primary">
                      {contact.name}
                    </span>
                    {contact.isPrimary && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-subtle text-accent text-[11px] font-medium">
                        <Star size={10} />
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-text-secondary mt-0.5">{contact.role}</p>

                  <div className="flex flex-wrap gap-4 mt-3">
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-accent transition-colors"
                    >
                      <Phone size={13} />
                      {contact.phone}
                    </a>
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-accent transition-colors"
                    >
                      <Mail size={13} />
                      {contact.email}
                    </a>
                  </div>

                  {contact.notes && (
                    <p className="text-[13px] text-text-tertiary mt-2 bg-bg-page rounded-lg px-3 py-2">
                      {contact.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TabEngagements({ donor }: { donor: (typeof donors)[0] }) {
  const sorted = [...donor.engagements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-text-tertiary">
          {donor.engagements.length} engagement{donor.engagements.length !== 1 ? 's' : ''}
        </p>
        <Button size="sm">
          <Plus size={14} />
          Log engagement
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-10 text-center">
          <Calendar size={24} className="text-text-tertiary mx-auto mb-3" />
          <p className="text-[14px] text-text-primary font-medium">No engagements logged</p>
          <p className="text-[13px] text-text-tertiary mt-1">
            Log a meeting, call, or site visit.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[17px] top-4 bottom-4 w-px bg-border-subtle" />
          <div className="space-y-4">
            {sorted.map((eng: Engagement) => (
              <div key={eng.id} className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-9 h-9 rounded-full bg-bg-surface border border-border-default flex items-center justify-center flex-shrink-0 z-10">
                  <EngagementTypeIcon type={eng.type} />
                </div>
                {/* Card */}
                <div className="flex-1 bg-bg-surface rounded-[10px] border border-border-subtle p-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={eng.type.toLowerCase()}>{eng.type}</Badge>
                      <span className="text-[13px] text-text-secondary">{formatDate(eng.date)}</span>
                    </div>
                    {eng.sharepointLink && (
                      <a
                        href={eng.sharepointLink}
                        className="flex items-center gap-1 text-[12px] text-accent hover:text-accent-hover transition-colors"
                      >
                        <ExternalLink size={12} />
                        SharePoint
                      </a>
                    )}
                  </div>
                  <p className="text-[14px] text-text-primary leading-relaxed">{eng.notes}</p>
                  {eng.linkedEntity && (
                    <p className="text-[12px] text-text-tertiary mt-2">
                      Linked: {eng.linkedEntity}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TabOpportunities({ donor }: { donor: (typeof donors)[0] }) {
  const [stageFilter, setStageFilter] = useState<string>('All');
  const stages = ['All', 'Prospect', 'Due diligence', 'Draft', 'Review', 'Won', 'Lost'];

  const filtered =
    stageFilter === 'All'
      ? donor.opportunities
      : donor.opportunities.filter((o) => o.stage === stageFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-text-tertiary">
          {donor.opportunities.length} opportunit{donor.opportunities.length !== 1 ? 'ies' : 'y'}
        </p>
        <Button size="sm">
          <Plus size={14} />
          Add opportunity
        </Button>
      </div>

      {/* Stage filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {stages.map((s) => (
          <button
            key={s}
            onClick={() => setStageFilter(s)}
            className={`h-7 px-3 rounded-lg text-[12px] font-medium transition-colors border ${
              stageFilter === s
                ? 'bg-accent text-white border-accent'
                : 'bg-bg-surface border-border-default text-text-secondary hover:bg-bg-hover'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-10 text-center">
          <TrendingUp size={24} className="text-text-tertiary mx-auto mb-3" />
          <p className="text-[14px] text-text-primary font-medium">No opportunities</p>
          <p className="text-[13px] text-text-tertiary mt-1">
            {stageFilter !== 'All' ? 'None in this stage.' : 'Add an opportunity to get started.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((opp: Opportunity) => (
            <div
              key={opp.id}
              className="bg-bg-surface rounded-[10px] border border-border-subtle p-4 hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[15px] font-semibold text-text-primary truncate">
                      {opp.name}
                    </span>
                    <Badge variant={opp.stage.toLowerCase().replace(' ', '-')}>{opp.stage}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-[12px] text-text-secondary">
                    <span>
                      Win probability:{' '}
                      <span className="font-medium text-text-primary">{opp.winProbability}%</span>
                    </span>
                    <span>
                      Expected:{' '}
                      <span className="font-medium text-text-primary">
                        €{opp.expectedRevenue.toFixed(1)}M
                      </span>
                    </span>
                    <span>
                      Weighted:{' '}
                      <span className="font-medium text-text-primary">
                        €{((opp.expectedRevenue * opp.winProbability) / 100).toFixed(1)}M
                      </span>
                    </span>
                    <span>RM: {opp.assignedRM}</span>
                    <span>Deadline: {formatDate(opp.deadline)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {opp.sharepointLink && (
                    <a
                      href={opp.sharepointLink}
                      className="flex items-center gap-1 text-[12px] text-accent hover:text-accent-hover transition-colors"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                  {/* Win probability bar */}
                  <div className="w-16 h-1.5 bg-neutral-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${opp.winProbability}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TabGrants({ donor }: { donor: (typeof donors)[0] }) {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const statuses = ['All', 'Ongoing', 'Closed', 'Rejected', 'Pending'];

  const filtered =
    statusFilter === 'All'
      ? donor.grants
      : donor.grants.filter((g) => g.status === statusFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-text-tertiary">
          {donor.grants.length} grant{donor.grants.length !== 1 ? 's' : ''}
        </p>
        <Button size="sm">
          <Plus size={14} />
          Add grant
        </Button>
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`h-7 px-3 rounded-lg text-[12px] font-medium transition-colors border ${
              statusFilter === s
                ? 'bg-accent text-white border-accent'
                : 'bg-bg-surface border-border-default text-text-secondary hover:bg-bg-hover'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-10 text-center">
          <Layers size={24} className="text-text-tertiary mx-auto mb-3" />
          <p className="text-[14px] text-text-primary font-medium">No grants found</p>
          <p className="text-[13px] text-text-tertiary mt-1">
            {statusFilter !== 'All' ? 'None with this status.' : 'Add a grant to get started.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((grant: Grant) => {
            const consumedPct =
              grant.amountAwarded > 0
                ? Math.round(
                    ((grant.amountAwarded - grant.remainingBalance) / grant.amountAwarded) * 100,
                  )
                : 0;
            return (
              <div
                key={grant.id}
                className="bg-bg-surface rounded-[10px] border border-border-subtle p-4 hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[12px] font-mono font-medium text-text-tertiary">
                        {grant.code}
                      </span>
                      <Badge variant={grant.status.toLowerCase()}>{grant.status}</Badge>
                    </div>
                    <p className="text-[15px] font-semibold text-text-primary">{grant.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[12px] mb-3">
                  <div>
                    <p className="text-text-tertiary">Awarded</p>
                    <p className="font-semibold text-text-primary">
                      €{grant.amountAwarded.toFixed(1)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-text-tertiary">Remaining</p>
                    <p className="font-semibold text-success">
                      €{grant.remainingBalance.toFixed(1)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-text-tertiary">Period</p>
                    <p className="font-medium text-text-primary">
                      {formatDate(grant.startDate)} – {formatDate(grant.endDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-tertiary">RM</p>
                    <p className="font-medium text-text-primary">{grant.assignedRM}</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-neutral-bg rounded-full h-1.5 mb-2">
                  <div
                    className="bg-accent rounded-full h-1.5"
                    style={{ width: `${consumedPct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-text-tertiary">
                  <span>{consumedPct}% consumed</span>
                  {grant.nextReportingDeadline && (
                    <span className="flex items-center gap-1">
                      Next report: {formatDate(grant.nextReportingDeadline)}
                      {grant.status === 'Ongoing' && (
                        <DeadlineChip date={grant.nextReportingDeadline} />
                      )}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TabDocuments({ donor }: { donor: (typeof donors)[0] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-text-tertiary">
          {donor.documents.length} document{donor.documents.length !== 1 ? 's' : ''}
        </p>
        <Button size="sm">
          <Plus size={14} />
          Upload document
        </Button>
      </div>

      {donor.documents.length === 0 ? (
        <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-10 text-center">
          <FileText size={24} className="text-text-tertiary mx-auto mb-3" />
          <p className="text-[14px] text-text-primary font-medium">No documents</p>
          <p className="text-[13px] text-text-tertiary mt-1">
            Upload documents linked to grants or opportunities.
          </p>
        </div>
      ) : (
        <div className="bg-bg-surface rounded-[10px] border border-border-subtle overflow-hidden">
          {donor.documents.map((doc: Document, idx) => (
            <div
              key={doc.id}
              className={`flex items-center gap-4 px-4 py-3.5 hover:bg-bg-hover transition-colors ${
                idx < donor.documents.length - 1 ? 'border-b border-border-subtle' : ''
              }`}
            >
              <FileTypeIcon type={doc.fileType} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-text-primary truncate">{doc.name}</p>
                <div className="flex items-center gap-2 mt-0.5 text-[12px] text-text-tertiary flex-wrap">
                  <span>{doc.author}</span>
                  <span>·</span>
                  <span>{formatDate(doc.lastModified)}</span>
                  {doc.linkedEntity && (
                    <>
                      <span>·</span>
                      <span>Linked: {doc.linkedEntity}</span>
                    </>
                  )}
                </div>
              </div>
              <a
                href={doc.sharepointUrl}
                className="flex items-center gap-1.5 text-[13px] text-accent hover:text-accent-hover transition-colors flex-shrink-0"
              >
                <ExternalLink size={13} />
                Open
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TabActivity({ donor }: { donor: (typeof donors)[0] }) {
  const sorted = [...donor.activity].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="space-y-4">
      <p className="text-[13px] text-text-tertiary">
        {donor.activity.length} event{donor.activity.length !== 1 ? 's' : ''}
      </p>

      {sorted.length === 0 ? (
        <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-10 text-center">
          <Activity size={24} className="text-text-tertiary mx-auto mb-3" />
          <p className="text-[14px] text-text-primary font-medium">No activity yet</p>
          <p className="text-[13px] text-text-tertiary mt-1">
            Activity is recorded automatically as you work.
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[17px] top-4 bottom-4 w-px bg-border-subtle" />
          <div className="space-y-4">
            {sorted.map((entry: ActivityEntry) => (
              <div key={entry.id} className="flex items-start gap-4">
                <div className="z-10">
                  <ActivityIcon type={entry.actionType} />
                </div>
                <div className="flex-1 bg-bg-surface rounded-[10px] border border-border-subtle p-3.5">
                  <p className="text-[14px] text-text-primary">{entry.description}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-[12px] text-text-tertiary">
                    <span>{entry.actor}</span>
                    <span>·</span>
                    <span>{formatDateTime(entry.date)}</span>
                    {entry.linkedEntity && (
                      <>
                        <span>·</span>
                        <span className="text-accent">{entry.linkedEntity}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Main DonorDetail ----

export function DonorDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('360');

  const donor = donors.find((d) => d.id === id);

  if (!donor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <p className="text-[18px] font-semibold text-text-primary mb-2">Donor not found</p>
        <Link
          to="/donors"
          className="flex items-center gap-2 text-[14px] text-accent hover:text-accent-hover transition-colors mt-2"
        >
          <ArrowLeft size={14} />
          Back to donors
        </Link>
      </div>
    );
  }

  const donorInitials = donor.name
    .split(/\s+/)
    .filter((w: string) => /[A-Za-z]/.test(w[0] ?? ''))
    .slice(0, 2)
    .map((w: string) => w[0].toUpperCase())
    .join('');

  return (
    <div className="max-w-[920px] space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px]">
        <Link
          to="/donors"
          className="text-text-tertiary hover:text-text-secondary transition-colors flex items-center gap-1"
        >
          <ArrowLeft size={13} />
          Donors
        </Link>
        <ChevronRight size={13} className="text-text-tertiary" />
        <span className="text-text-primary">{donor.name}</span>
      </div>

      {/* Donor header card */}
      <div className="bg-bg-surface rounded-[12px] border border-border-subtle p-5">
        <div className="flex items-start gap-4">
          <Avatar initials={donorInitials} size="lg" />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-[20px] font-semibold text-text-primary">{donor.name}</h1>
                  <Badge variant={donor.type.toLowerCase()}>{donor.type}</Badge>
                  <Badge variant={donor.status.toLowerCase()}>{donor.status}</Badge>
                  {donor.overdueCount > 0 && (
                    <Badge variant="overdue">{donor.overdueCount} overdue</Badge>
                  )}
                </div>

                {/* Quick info row */}
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  <div className="flex items-center gap-1.5 text-[13px] text-text-secondary">
                    <Mail size={13} className="text-text-tertiary" />
                    <a href={`mailto:${donor.email}`} className="hover:text-accent transition-colors">
                      {donor.email}
                    </a>
                  </div>
                  {donor.phone && (
                    <div className="flex items-center gap-1.5 text-[13px] text-text-secondary">
                      <Phone size={13} className="text-text-tertiary" />
                      {donor.phone}
                    </div>
                  )}
                  {donor.website && (
                    <a
                      href={`https://${donor.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-accent transition-colors"
                    >
                      <Globe size={13} className="text-text-tertiary" />
                      {donor.website}
                    </a>
                  )}
                </div>

                {/* Assigned RM */}
                <div className="flex items-center gap-2 mt-2">
                  <Avatar initials={donor.assignedRM.initials} size="sm" />
                  <span className="text-[13px] text-text-secondary">
                    {donor.assignedRM.name}
                  </span>
                  <span className="text-[12px] text-text-tertiary">— Relationship Manager</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm">
                  <Calendar size={14} />
                  Log engagement
                </Button>
                <Button size="sm">
                  <Plus size={14} />
                  Add opportunity
                </Button>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border-subtle flex-wrap">
              <div>
                <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.04em]">
                  Total awarded
                </p>
                <p className="text-[16px] font-semibold text-text-primary">
                  €{donor.totalAwarded.toFixed(1)}M
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.04em]">
                  Remaining
                </p>
                <p className="text-[16px] font-semibold text-success">
                  €{donor.remainingBalance.toFixed(1)}M
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.04em]">
                  Active grants
                </p>
                <p className="text-[16px] font-semibold text-text-primary">
                  {donor.activeGrants}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.04em]">
                  Opportunities
                </p>
                <p className="text-[16px] font-semibold text-text-primary">
                  {donor.activeOpportunities}
                </p>
              </div>
              {donor.nextDeadline && (
                <div className="ml-auto">
                  <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.04em]">
                    Next deadline
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[14px] font-medium text-text-primary">
                      {formatDate(donor.nextDeadline.date)}
                    </span>
                    <DeadlineChip date={donor.nextDeadline.date} />
                  </div>
                  <p className="text-[11px] text-text-tertiary">{donor.nextDeadline.type}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border-subtle">
        <div className="flex items-center gap-0 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-default'
              }`}
            >
              {tab}
              {tab === 'Contacts' && donor.contacts.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-bg text-[10px] text-neutral font-semibold">
                  {donor.contacts.length}
                </span>
              )}
              {tab === 'Grants' && donor.grants.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-bg text-[10px] text-neutral font-semibold">
                  {donor.grants.length}
                </span>
              )}
              {tab === 'Opportunities' && donor.opportunities.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-bg text-[10px] text-neutral font-semibold">
                  {donor.opportunities.length}
                </span>
              )}
              {tab === 'Documents' && donor.documents.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-bg text-[10px] text-neutral font-semibold">
                  {donor.documents.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="pb-12">
        {activeTab === '360' && <Tab360 donor={donor} />}
        {activeTab === 'About' && <TabAbout donor={donor} />}
        {activeTab === 'Contacts' && <TabContacts donor={donor} />}
        {activeTab === 'Engagements' && <TabEngagements donor={donor} />}
        {activeTab === 'Opportunities' && <TabOpportunities donor={donor} />}
        {activeTab === 'Grants' && <TabGrants donor={donor} />}
        {activeTab === 'Documents' && <TabDocuments donor={donor} />}
        {activeTab === 'Activity' && <TabActivity donor={donor} />}
      </div>
    </div>
  );
}
