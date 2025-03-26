export interface Opportunity {
  id: string;
  name: string;
  type: OpportunityType;
  priority: OpportunityPriority;
  status: OpportunityStatus;
  location: string;
  size: number;
  value: string;
  confidence: number;
  addedDate: Date;
  closedDate: Date;
  age: number;
  closureReason: string;
  proposalLink: string;
  contactId: string;
  stage:OpportunityStage;
  substage: OpportunitySubStage;
  customerID?:string;
}

export enum OpportunityConfidence {
  GuaranteedWin = 'Guaranteed Win',
  VeryPromising = 'Very Promising',
  PotentialLead = 'Potential Lead',
  LongShot = 'LongShot',
  Unlikely = 'Unlikely'
}

export enum OpportunityStage {
  Prospecting = 'Prospecting',
  Qualification = 'Qualification',
  Requirements = 'Requirements',
  Proposal = 'Proposal',
  Negotiation = 'Negotiation',
  Closed = 'Closed',
  PostSales = 'Post Sales',
}

export enum OpportunitySubStage {
  // Substages for Prospecting
  InitialContact = 'Initial Contact',
  FollowUp = 'Follow Up',

    // Substages for Closed
    Closed = 'Closed',

    PostSales = 'Post Sales',

    // Substages for Qualification
  NeedAnalysis = 'Need Analysis',
  BudgetCheck = 'Budget Check',

  // Substages for Negotiation:
  DeliveryTerms = 'Delivery Terms',
  PriceDiscussion = 'Price Discussion',
  PendingApproval = 'Pending Approval',
  Interviews = 'Interviews',

  // Substages for Proposal:
  PreSalesDiscussion = 'PreSales Discussion',
  ProposalCreation = 'Proposal Creation',
  ProposalSubmitted = 'Proposal Submitted',
  ProposalRevision = 'Proposal Revision',
  OnHold = 'On Hold',

  // Substages for Requirements
  DiscoveryWorkshop = 'Discovery Workshop',
  PRDReceived = 'PRD Received',
  RFPReceived = 'RFP Received',
  AwaitingRequirenments = 'Awaiting Requirenments',
  StaffingNeeds = 'Staffing Needs',
}

export const StageSubStageMap: Record<OpportunityStage, OpportunitySubStage[]> =
  {
    [OpportunityStage.Prospecting]: [
      OpportunitySubStage.InitialContact,
      OpportunitySubStage.FollowUp,
    ],
    [OpportunityStage.Closed]: [OpportunitySubStage.Closed],

    [OpportunityStage.PostSales]: [OpportunitySubStage.PostSales],
    [OpportunityStage.Qualification]: [
      OpportunitySubStage.NeedAnalysis,
      OpportunitySubStage.BudgetCheck,
    ],
    [OpportunityStage.Requirements]: [
      OpportunitySubStage.DiscoveryWorkshop,
      OpportunitySubStage.PRDReceived,
      OpportunitySubStage.RFPReceived,
      OpportunitySubStage.AwaitingRequirenments,
      OpportunitySubStage.StaffingNeeds,
    ],
    [OpportunityStage.Negotiation]: [
      OpportunitySubStage.DeliveryTerms,
      OpportunitySubStage.PriceDiscussion,
      OpportunitySubStage.PendingApproval,
      OpportunitySubStage.Interviews,
    ],
    [OpportunityStage.Proposal]: [
      OpportunitySubStage.PreSalesDiscussion,
      OpportunitySubStage.ProposalCreation,
      OpportunitySubStage.ProposalSubmitted,
      OpportunitySubStage.ProposalRevision,
      OpportunitySubStage.OnHold,
    ],
  };

export enum OpportunityLocation {
  Client = 'Client',
  Hybrid = 'Hybrid',
  Coditas = 'Coditas',
}



export enum OpportunityType {
  Managed = 'Managed',
  StaffAugmentation = 'Staff Augmentation',
}

export enum OpportunityPriority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export enum OpportunityStatus {
  Open = 'Open',
  ClosedWon = 'Closed Won',
  ClosedLost = 'Closed Lost',
  Dropped = 'Dropped',
  OnHold = 'On Hold',
}
