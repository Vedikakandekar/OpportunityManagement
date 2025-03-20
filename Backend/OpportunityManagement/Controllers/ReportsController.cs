using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpportunityManagement.Data.Services.Contracts;

namespace OpportunityManagement.Controllers
{
    [Route("api/Reports")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly IReportsService _reportsService;
        public ReportsController(IReportsService reportsService)
        {
            _reportsService = reportsService;
        }

        [HttpGet("getKeyMetrics")]
        public async Task<IActionResult> getKeyMetrics()
        {
           string currentLoggedInUser = User.FindFirst("UserId")?.Value;
           if (string.IsNullOrEmpty(currentLoggedInUser))
           {
               throw new UnauthorizedAccessException("User is not authorized.");
           }
           var result = _reportsService.getKeyMetrics();

           return Ok(new
           {
              result
           });
        }

        [HttpGet("getAnalyticsData")]
        public async Task<IActionResult> getAnalyticsData()
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            var result = _reportsService.GetAnalyticsData();

            return Ok(new
            {
                result
            });
        }
    }
}
