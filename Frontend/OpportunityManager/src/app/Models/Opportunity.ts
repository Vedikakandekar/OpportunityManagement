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
  GuaranteedWin = 'GuaranteedWin',
  VeryPromising = 'VeryPromising',
  PotentialLead = 'PotentialLead',
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
  PostSales = 'PostSales',
}

export enum OpportunitySubStage {
  // Substages for Prospecting
  InitialContact = 'InitialContact',
  FollowUp = 'FollowUp',

    // Substages for Closed
    Closed = 'Closed',

    PostSales = 'PostSales',

    // Substages for Qualification
  NeedAnalysis = 'NeedAnalysis',
  BudgetCheck = 'BudgetCheck',

  // Substages for Negotiation:
  DeliveryTerms = 'DeliveryTerms',
  PriceDiscussion = 'PriceDiscussion',
  PendingApproval = 'PendingApproval',
  Interviews = 'Interviews',

  // Substages for Proposal:
  PreSalesDiscussion = 'PreSalesDiscussion',
  ProposalCreation = 'ProposalCreation',
  ProposalSubmitted = 'ProposalSubmitted',
  ProposalRevision = 'ProposalRevision',
  OnHold = 'OnHold',

  // Substages for Requirements
  DiscoveryWorkshop = 'DiscoveryWorkshop',
  PRDReceived = 'PRDReceived',
  RFPReceived = 'RFPReceived',
  AwaitingRequirenments = 'AwaitingRequirenments',
  StaffingNeeds = 'StaffingNeeds',
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
  StaffAugmentation = 'StaffAugmentation',
}

export enum OpportunityPriority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export enum OpportunityStatus {
  Open = 'Open',
  ClosedWon = 'ClosedWon',
  ClosedLost = 'ClosedLost',
  Dropped = 'Dropped',
  OnHold = 'OnHold',
}
