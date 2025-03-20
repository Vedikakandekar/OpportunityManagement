using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpportunityManagement.Data.Services;
using OpportunityManagement.Data.Services.Contracts;
using OpportunityManagement.Models.DTOs;

namespace OpportunityManagement.Controllers
{
    [Route("api/Resources")]
    [ApiController]
    public class ResourceController : ControllerBase
    {
        private readonly IResourceService resourceService;
        public ResourceController(IResourceService service)
        {
            resourceService = service;
        }

        [Authorize]
        [HttpGet("getAllResources")]
        public async Task<IActionResult> getAllResources([FromQuery] int page = 1,
        [FromQuery] int pageSize = 5)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            var result = resourceService.GetResourceDetails(currentLoggedInUser, page, pageSize);
          
            return Ok(new
            {
                res = result.Items,
                totalRecords = result.TotalCount,
                pageSize = pageSize
            });
        }

        [Authorize]
        [HttpGet("getAllResourcesNonPaginated")]
        public async Task<IActionResult> getAllResourcesNonPaginated()
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            var result = resourceService.GetResourceDetailsNonPaginated(currentLoggedInUser);
            return Ok(result);
        }


        [Authorize]
        [HttpGet("search")]
        public async Task<IActionResult> SearchCustomers([FromQuery] string searchTerm, [FromQuery] int page = 1,
[FromQuery] int pageSize = 10)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            var result = resourceService.searchResource(searchTerm, currentLoggedInUser, page, pageSize);
            return Ok(new
            {
                res = result.Items,
                totalRecords = result.TotalCount,
                pageSize = pageSize
            });
        }

        [Authorize]
        [HttpPost("addResource")]
        public async Task<IActionResult> addResource([FromForm] ResourceDTO contactDTO)
        { 
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            resourceService.AddResource(contactDTO, currentLoggedInUser);
            return Ok(new { succeeded = true });
        }

        [Authorize]
        [HttpPost("addProjectToResource")]
        public async Task<IActionResult> addProjectToResource([FromForm] string projectId, [FromForm] List<string> selectedResourceIds)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            if (string.IsNullOrEmpty(projectId) || selectedResourceIds == null || !selectedResourceIds.Any())
            {
                return BadRequest("Invalid data provided.");
            }
            resourceService.AddProjectToResource(projectId,selectedResourceIds, currentLoggedInUser);
            return Ok(new { succeeded = true });
        }

        [Authorize]
        [HttpPost("updateResource")]
        public async Task<IActionResult> updateResource([FromBody] ResourceDTO resourceDTO)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            if (resourceDTO == null)
            {
                throw new ArgumentNullException("Invalid contact data.");
            }
            resourceService.updateResource(resourceDTO, currentLoggedInUser);
            return Ok(new { succeeded = true });
        }

        [Authorize]
        [HttpDelete("deleteResource")]
        public async Task<IActionResult> deledeleteResourceteSkill([FromQuery] string resourceId)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            if (resourceId == null)
            {
                throw new ArgumentNullException("Invalid SKills data.");
            }
            resourceService.deleteResource(resourceId, currentLoggedInUser);
            return Ok(new { succeeded = true });
        }

    }

}
