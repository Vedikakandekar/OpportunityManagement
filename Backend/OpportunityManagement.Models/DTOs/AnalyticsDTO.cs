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
    }

}
