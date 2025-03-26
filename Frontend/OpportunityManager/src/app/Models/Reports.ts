import { OpportunityStage } from "./Opportunity";

export interface KeyMetrics {
    averageDealSize: number;
    averageDealSizeTrend: string;
    pipelineValue: number;
    pipelineTrend: string;  
    totalOpportunities: number;
    opportunityTrend: string;
    winRate: WinRate;
}

export interface WinRate {
    totalWinRate: number;
    currentWinRate: number;
    lastMonthWinRate: number;
    percentageDifference: number;
    trend: string;
}

export interface SalesRepPipeline {
    name: string;
    stageValues: {
      [key in OpportunityStage]?: number;
    };
  }

export interface AnalyticsData {
    monthlyDealValuation: number[];
    monthlyDealCount: number[];
    opportunityStatusCounts: number[];
    resourceRequirements: { name: string; count: number }[];
    keyOpportunities: any[];
    stageFunnel: StageFunnelData[];
    salesRepPipelineData: SalesRepPipeline[];
}

export interface StageFunnelData {
    stage: OpportunityStage;
    count: number;
    valuation: number;
  }