
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
    currentWinRate: number;
    lastMonthWinRate: number;
    percentageDifference: number;
    trend: string;
}

export interface AnalyticsData {
    monthlyDealValuation: number[];
    monthlyDealCount: number[];
    opportunityStatusCounts: number[];
    resourceRequirements: { name: string; count: number }[];
    keyOpportunities: any[];
}

