export type DonorType = 'Philanthropic' | 'Government' | 'Bilateral' | 'Multilateral' | 'Corporate';
export type DonorStatus = 'Active' | 'Inactive' | 'Past';
export type GrantStatus = 'Ongoing' | 'Closed' | 'Rejected' | 'Pending';
export type OpportunityStage = 'Prospect' | 'Due diligence' | 'Draft' | 'Review' | 'Won' | 'Lost';
export type EngagementType = 'Meeting' | 'Site visit' | 'Call';
export type BadgeVariant =
  | 'active'
  | 'pending'
  | 'inactive'
  | 'overdue'
  | 'philanthropic'
  | 'government'
  | 'multilateral'
  | 'bilateral'
  | 'corporate'
  | 'won'
  | 'lost';

export interface RM {
  id: string;
  name: string;
  initials: string;
  email: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  isPrimary: boolean;
  phone: string;
  email: string;
  notes?: string;
  alsoLinkedTo?: string;
}

export interface Engagement {
  id: string;
  type: EngagementType;
  date: string;
  notes: string;
  linkedEntity?: string;
  sharepointLink?: string;
}

export interface Grant {
  id: string;
  code: string;
  name: string;
  status: GrantStatus;
  amountAwarded: number;
  remainingBalance: number;
  startDate: string;
  endDate: string;
  assignedRM: string;
  nextReportingDeadline: string;
}

export interface Opportunity {
  id: string;
  name: string;
  stage: OpportunityStage;
  winProbability: number;
  expectedRevenue: number;
  assignedRM: string;
  deadline: string;
  status: string;
  sharepointLink?: string;
}

export interface Document {
  id: string;
  name: string;
  lastModified: string;
  author: string;
  linkedEntity: string;
  sharepointUrl: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'pptx';
}

export interface ActivityEntry {
  id: string;
  date: string;
  actionType:
    | 'stage-change'
    | 'document-upload'
    | 'task-completed'
    | 'grant-created'
    | 'contact-added'
    | 'engagement-logged'
    | 'financial-update';
  description: string;
  actor: string;
  linkedEntity?: string;
}

export interface RevenueYear {
  year: number;
  confirmed: number;
  weighted: number;
}

export interface Donor {
  id: string;
  name: string;
  shortName: string;
  type: DonorType;
  status: DonorStatus;
  assignedRM: RM;
  totalAwarded: number;
  remainingBalance: number;
  consumed: number;
  phone: string;
  email: string;
  website: string;
  address: string;
  notes: string;
  mmvAnnualReport: boolean;
  pdpReport: boolean;
  nextDeadline: { type: string; date: string } | null;
  overdueCount: number;
  activeOpportunities: number;
  activeGrants: number;
  contacts: Contact[];
  engagements: Engagement[];
  grants: Grant[];
  opportunities: Opportunity[];
  documents: Document[];
  activity: ActivityEntry[];
  revenueByYear: RevenueYear[];
  nextEngagement?: {
    date: string;
    type: EngagementType;
    notes: string;
    linkedEntity?: string;
  };
}

export interface TodoItem {
  id: string;
  name: string;
  type: 'task' | 'milestone' | 'report';
  donorName: string;
  dueDate: string;
  isOverdue: boolean;
  completed: boolean;
}
