using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Models.DTOs
{
    public class KeyMetricsDTO
    {
        public int? totalOpportunities {  get; set; }

        public string? opportunityTrend { get; set; }
        public int? pipelineValue { get; set; }

        public string? pipelineTrend { get; set; }

        public WinRateStatistics winRate { get; set; }

        public float? averageDealSize { get; set; }

        public string? averageDealSizeTrend { get; set; }

    }
public class WinRateStatistics
{
    public double CurrentWinRate { get; set; }
    public double LastMonthWinRate { get; set; }
    public double PercentageDifference { get; set; }
    public string? Trend { get; set; } // e.g., "3% increased vs last month"

    }

}
