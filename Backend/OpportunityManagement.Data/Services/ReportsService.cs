using OpportunityManagement.Data.Repository.Contracts;
using OpportunityManagement.Data.Services.Contracts;
using OpportunityManagement.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Data.Services
{
    public class ReportsService : IReportsService
    {
        public readonly IOpportunityRepository opportunityRepository;

        public readonly IProjectsRepository projectsRepository;

        public readonly IResourceRepository resourceRepository;

        public readonly ISkillsRepository skillsRepository;

        public readonly ICustomerRepository customerRepo;

        public readonly IContactsRepository contactsRepository;

        public readonly IOpportunitySkillsRepository opportunitySkillsRepository;

        public ReportsService(IProjectsRepository repo,
            ISkillsRepository skillsRepo,
            IResourceRepository resourcessRepo,
            IOpportunityRepository repository,
              IOpportunitySkillsRepository _opportunitySkillsRepository
         )
        {
            projectsRepository = repo;
            resourceRepository = resourcessRepo;
            skillsRepository = skillsRepo;
            opportunityRepository = repository;
            opportunitySkillsRepository = _opportunitySkillsRepository;
        }

        public KeyMetricsDTO getKeyMetrics()
        {
            var allOpportunities = opportunityRepository.GetAll(includeProperties: "Status,SubStage,SubStage.Stage").AsQueryable();

            if (allOpportunities == null || !allOpportunities.Any())
            {
                return new KeyMetricsDTO
                {
                    totalOpportunities = 0,
                    opportunityTrend = "No data available",
                    pipelineValue = 0,
                    pipelineTrend = "No data available",
                    winRate = new WinRateStatistics
                    {
                        CurrentWinRate = 0,
                        LastMonthWinRate = 0,
                        PercentageDifference = 0,
                        Trend = "No data available"
                    },
                    averageDealSize = 0,
                    averageDealSizeTrend = "No data available"
                };
            }

            var currentMonthStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);

            var lastMonthStart = currentMonthStart.AddMonths(-1);

            var lastMonthEnd = currentMonthStart.AddDays(-1);

            // Pre-filtered queries to avoid redundant database calls
            var allOpenOpportunities = allOpportunities.Where(o => o.Status != null && o.Status.StatusName == "Open");

            var allClosedWinOpportunities = allOpportunities.Where(o => o.Status != null && o.Status.StatusName == "Closed Won");

            var totalOpenOpportunities = allOpenOpportunities.Count();

            var totalOpenOpportunitiesCurrent = allOpenOpportunities.Count(o => o.AddedDate >= currentMonthStart);

            var totalPipelineAll = allOpenOpportunities.Where(o => o.SubStage.Stage.Name == "Proposal" || o.SubStage.Stage.Name == "Negotiation").Sum(o => (double?)o.Value) ?? 0;

            var pipelineValueCurrent = allOpenOpportunities.Where(o => o.AddedDate >= currentMonthStart).Sum(o => (double?)o.Value) ?? 0;

            var totalOpenOpportunitiesLast = allOpportunities.Count(o => o.AddedDate >= lastMonthStart && o.AddedDate <= lastMonthEnd);

            var pipelineValueLast = allOpenOpportunities.Where(o => o.AddedDate >= lastMonthStart && o.AddedDate <= lastMonthEnd)
                                         .Sum(o => (double?)o.Value) ?? 0;

            // Win Rate Calculation
            var wonOpportunitiesCurrent = allClosedWinOpportunities.Count(o => o.AddedDate >= currentMonthStart);

            var wonOpportunitiesLast = allClosedWinOpportunities.Count(o => o.AddedDate >= lastMonthStart && o.AddedDate <= lastMonthEnd);

            var totalOpportunitiesCurrent = allOpportunities.Where(o => o.AddedDate >= currentMonthStart).Count();

            var totalOpportunitiesLast = allOpportunities.Where(o => o.AddedDate >= lastMonthStart && o.AddedDate<=lastMonthEnd).Count();

            double currentWinRate = wonOpportunitiesCurrent == 0 ? 0 :
                ((double)wonOpportunitiesCurrent / totalOpportunitiesCurrent) * 100;

            double lastMonthWinRate = totalOpportunitiesLast == 0 ? 0 :
                ((double)wonOpportunitiesLast / totalOpportunitiesLast) * 100;

            double totalWinRate = allClosedWinOpportunities.Count() == 0 ? 0 :
                ((double)allClosedWinOpportunities.Count() / allOpportunities.Count() )* 100;

            // Average Deal Size Calculation
            var averageDealSizeCurrent = allClosedWinOpportunities.Where(o => o.AddedDate >= currentMonthStart).Average(o => (double?)o.Value) ?? 0;
            var averageDealSizeLast = allClosedWinOpportunities.Where(o => o.AddedDate >= lastMonthStart && o.AddedDate <= lastMonthEnd )
                                           .Average(o => (double?)o.Value) ?? 0;

            // Trend Calculation for Each Metric
            string GetTrend(double current, double last)
            {
                if (last == 0) return "No trend data available";
                double difference = current - last;
                return difference >= 0 ? $"{difference:F2}% increased vs last month" : $"{Math.Abs(difference):F2}% decreased vs last month";
            }

            return new KeyMetricsDTO
            {
                totalOpportunities = totalOpenOpportunities,
                opportunityTrend = GetTrend(totalOpportunitiesCurrent, totalOpportunitiesLast),
                pipelineValue = (int)totalPipelineAll,
                pipelineTrend = GetTrend(pipelineValueCurrent, pipelineValueLast),
                winRate = new WinRateStatistics
                {
                    totalWinRate = totalWinRate,
                    CurrentWinRate = currentWinRate,
                    LastMonthWinRate = lastMonthWinRate,
                    PercentageDifference = currentWinRate - lastMonthWinRate,
                    Trend = GetTrend(currentWinRate, lastMonthWinRate)
                },
                averageDealSize = (float)averageDealSizeCurrent,
                averageDealSizeTrend = GetTrend(averageDealSizeCurrent, averageDealSizeLast)
            };
        }

        public (int Quarter, DateTime StartDate, DateTime EndDate) GetCurrentQuarter()
        {
            var now = DateTime.Now;
            int quarter = (now.Month - 1) / 3 + 1; // Determines quarter (1 to 4)

            int quarterStartMonth = (quarter - 1) * 3 + 1; // First month of the quarter
            var startOfQuarter = new DateTime(now.Year, quarterStartMonth, 1);
            var endOfQuarter = startOfQuarter.AddMonths(3).AddDays(-1); // Last day of the quarter

            return (quarter, startOfQuarter, endOfQuarter);
        }

        public AnalyticsDTO GetAnalyticsData()
        {
            var (quarter, startOfQuarter, endOfQuarter) = GetCurrentQuarter();
            Console.WriteLine($"Current Quarter: Q{quarter} ({startOfQuarter:yyyy-MM-dd} to {endOfQuarter:yyyy-MM-dd})");

            var query = opportunityRepository.GetAll(includeProperties: "Status,Contact,Contact.Customer,Contact.Customer.AppUser,SubStage,SubStage.Stage,Priority,Confidence").AsQueryable();

            if (query == null || !query.Any())
            {
                return new AnalyticsDTO
                {
                    MonthlyDealCount = new int[3], // Default empty values
                    MonthlyDealValuation = new double[3]
                };
            }

            int[] monthlyDealCount = new int[3];
            double[] monthlyDealValuation = new double[3];

            for (int i = 0; i < 3; i++)
            {
                var monthStart = startOfQuarter.AddMonths(i);
                var monthEnd = monthStart.AddMonths(1).AddDays(-1);

                var dealsInMonth = query.Where(o => o.Status.StatusName == "Closed Won" &&  o.AddedDate >= monthStart && o.AddedDate <= monthEnd);
                monthlyDealCount[i] = dealsInMonth.Count();
                monthlyDealValuation[i] = dealsInMonth.Sum(o => (double?)o.Value) ?? 0;
            }
            int openCount = query.Count(o => o.Status != null && o.Status.StatusName == "Open");
            int closedWonCount = query.Count(o => o.Status != null && o.Status.StatusName == "Closed Won");
            int closedLostCount = query.Count(o => o.Status != null && o.Status.StatusName == "Closed Lost");
            int droppedCount = query.Count(o => o.Status != null && o.Status.StatusName == "Dropped");
            int onHoldCount = query.Count(o => o.Status != null && o.Status.StatusName == "On Hold");

            var openOpportunityIds = query.Where(o => o.Status.StatusName == "Open").Select(o => o.Id).ToList();

            // Fetch OpportunitySkills for all open opportunities
            var opportunitySkills = opportunitySkillsRepository
                .GetAll(includeProperties: "Skills")
                .Where(os => openOpportunityIds.Contains(os.OpportunityId))
                .ToList();

            // Aggregate skill requirements
            var skillCounts = opportunitySkills
                .GroupBy(os => os.Skills.SkillName)
                .Select(g => new ResourceRequirenmentAnalyticsDTO
                {
                    Name = g.Key,
                    Count = g.Sum(os => os.NumberOfPeople ?? 0)
                })
                .ToList();

            var highPriorityOpportunityList = query.Where(o => o.Status.StatusName == "Open" && o.Priority.PriorityLevel == "High").
                Select(o => new OpportunityFormDTO
                {
                    name = o.Name,
                    customer = o.Contact.Customer,
                    stage = o.SubStage.Stage.Name,
                    confidence = o.Confidence.ConfidenceLevel,
                    value = o.Value,
                }).ToList();

            var stageFunnelData = query
                .Where(o=>o.Status.StatusName=="Open")
                     .GroupBy(o => o.SubStage.Stage.Name) // Group by Stage
                     .Select(g => new StageFunnelData
                         {
                              Stage = g.Key,
                              Count = g.Count(),
                              Valuation = g.Sum(o => (double?)o.Value) ?? 0
                          })
                     .OrderByDescending(o=>o.Count)
                     .ToDictionary(stage => stage.Stage, stage => stage);


            var salesRepPipelineData = query
        .Where(o => o.Status.StatusName == "Open")
        .GroupBy(o => o.Contact.Customer.AppUser.FullName)  // Assuming the Sales Rep is stored in Customer Name
        .Select(g => new
        {
            Name = g.Key,
            StageValues = g.GroupBy(o => o.SubStage.Stage.Name)
                       .Select(stageGroup => new
                       {
                           Stage = stageGroup.Key,
                           Value = stageGroup.Sum(o => (double?)o.Value) ?? 0
                       })
                       .ToList() // Now it's safe to use ToList() after projection
        })
         .ToList() // Ensure query executes at the DB level
    .Select(g => new SalesRepPipelineDTO
    {
        Name = g.Name,
        StageValues = g.StageValues.ToDictionary(stage => stage.Stage, stage => stage.Value)
    })
    .ToList();

            return new AnalyticsDTO
            {
                MonthlyDealCount = monthlyDealCount,
                MonthlyDealValuation = monthlyDealValuation,
                OpportunityStatusCounts = new int[] { openCount, closedWonCount, closedLostCount, droppedCount, onHoldCount },
                ResourceRequirements = skillCounts,
                KeyOpportunities = highPriorityOpportunityList,
                StageFunnel = stageFunnelData,
                SalesRepPipelineData = salesRepPipelineData
            };
        }

    }
}