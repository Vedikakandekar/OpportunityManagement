using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Models.DTOs
{
    public class AnalyticsDTO
    {
        public int[] MonthlyDealCount { get; set; }
        public double[] MonthlyDealValuation { get; set; }

        public int[] OpportunityStatusCounts { get; set; }

        public List<ResourceRequirenmentAnalyticsDTO> ResourceRequirements { get; set; }

        public List<OpportunityFormDTO> KeyOpportunities { get; set; }
        public Dictionary<string, StageFunnelData> StageFunnel { get; set; }
        public List<SalesRepPipelineDTO> SalesRepPipelineData { get; set; }
    }

    // DTO to hold stage-wise funnel data
    public class StageFunnelData
    {
        public string Stage { get; set; }
        public int Count { get; set; }
        public double Valuation { get; set; }
    }

    public class SalesRepPipelineDTO
    {
        public string Name { get; set; }
        public Dictionary<string, double> StageValues { get; set; } = new();
    }

}
