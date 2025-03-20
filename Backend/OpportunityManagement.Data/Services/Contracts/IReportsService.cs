using OpportunityManagement.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Data.Services.Contracts
{
    public interface IReportsService
    {
        public KeyMetricsDTO getKeyMetrics();

        public AnalyticsDTO GetAnalyticsData();


    }
}
