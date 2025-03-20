using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpportunityManagement.Data.Services;
using OpportunityManagement.Data.Services.Contracts;
using OpportunityManagement.Models.DTOs;

namespace OpportunityManagement.Controllers
{
    [Route("api/Opportunity")]
    [ApiController]
    public class OpportunityController : ControllerBase
    {
        public readonly IOpportunityService _opportunityService;

        public readonly IUserService _userService;
        public OpportunityController(IOpportunityService service, IUserService userService)
        {
            _opportunityService = service;
            _userService = userService;
        }


        [HttpGet("getAllOpportunities")]
        public async Task<IActionResult> GetAllOpportunities([FromQuery] int page = 1, [FromQuery] int pageSize = 5)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var result = _opportunityService.GetAll(currentLoggedInUser, page, pageSize, baseUrl);

            return Ok(new
            {
                res = result.Items,
                totalRecords = result.TotalCount,
                pageSize = pageSize
            });
        }

        [HttpGet("GetOpportunitiesRelatedToCustomer")]
        public async Task<IActionResult> GetOpportunitiesRelatedToCustomer([FromQuery] string customerId)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            var result = _opportunityService.GetOpportunitiesRelatedToCustomer(currentLoggedInUser,customerId);

            return Ok(new
            {
                res = result
            });
        }

        [Authorize]
        [HttpGet("IsOpportunityNameUniqueForCustomer")]
        public async Task<IActionResult> IsOpportunityNameUniqueForCustomer([FromQuery] string name, [FromQuery] string customerId,[FromQuery] string? opportunityId = null)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            var result = _opportunityService.IsOpportunityNameUniqueForCustomer(currentLoggedInUser,name,customerId,opportunityId);


            return Ok(new
            {
                res = result
            });
        }


        [Authorize]
        [HttpGet("getUserProfileImage")]
        public async Task<IActionResult> getUserPgetUserProfileImagerofile()
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            var result = _userService.getUserProfile(currentLoggedInUser);

            string baseUrl = $"{Request.Scheme}://{Request.Host}"; // Get API Base URL
            string imageUrl = string.IsNullOrEmpty(result)
                ? $"{baseUrl}/Images/Profile/default.jpg"  // Use default image if no profile picture
                : $"{baseUrl}{result}";

            return Ok(new
            {
                res = imageUrl
            });
        }



        [Authorize]
        [HttpPost("addOpportunity")]
        public async Task<IActionResult> AddOpportunity([FromBody] OpportunityFormDTO opportunityFormDTO)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            if (opportunityFormDTO == null)
            {
                throw new ArgumentNullException("Invalid customer data.");
            }
            _opportunityService.AddOpportunity(opportunityFormDTO, currentLoggedInUser);
            return Ok(new { Succeeded = true });
        }


        [Authorize]
        [HttpPost("updateOpportunity")]
        public async Task<IActionResult> UpdateOpportunity([FromBody] OpportunityFormDTO opportunityFormDTO)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            if (opportunityFormDTO == null)
            {
                throw new  ArgumentNullException("Invalid customer data.");
            }
            _opportunityService.UpdateOpportunity(opportunityFormDTO, currentLoggedInUser);
            return Ok(new { Succeeded = true });
        }

        [Authorize]
        [HttpGet("filter")]
        public IActionResult GetFilteredOpportunities(
            [FromQuery] string? searchTerm,
       [FromQuery] string? sortBy,
       [FromQuery] string? show,
       [FromQuery] string? stage,
       [FromQuery] string? type,
       [FromQuery] string? status,
       [FromQuery] string? location,
       [FromQuery] string? priority,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }

            if (sortBy == null && show == null && stage == null && type == null && status == null && location == null && priority == null && searchTerm == null)
            {
                throw new ArgumentNullException("All !!");
            }
            var result = _opportunityService.GetFilteredOpportunities(searchTerm: searchTerm,sortBy: sortBy, show: show, stage: stage, type: type, status: status, location: location, priority: priority, currentLoggedInUser: currentLoggedInUser, page, pageSize);
            return Ok(new
            {
                res = result.Items,
                totalRecords = result.TotalCount,
                pageSize = pageSize
            });
            
        }


        }
}
