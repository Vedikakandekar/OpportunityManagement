using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpportunityManagement.Data.Repository.Contracts;
using OpportunityManagement.Data.Services.Contracts;
using OpportunityManagement.Models.DTOs;

namespace OpportunityManagement.Controllers
{
    [Route("api/Projects")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        public readonly IProjectService _projectsService;

        public readonly IUserService _userService;
        public ProjectsController(IProjectService service, IUserService userService)
        {
            _projectsService = service;
            _userService = userService;
        }


        [Authorize]
        [HttpGet("getAllProjects")]
        public async Task<IActionResult> getAllProjects([FromQuery] int page = 1, [FromQuery] int pageSize = 5)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            var result = _projectsService.GetAll(currentLoggedInUser, page, pageSize);

            return Ok(new
            {
                res = result.Items,
                totalRecords = result.TotalCount,
                pageSize = pageSize
            });
        }

        [Authorize]
        [HttpGet("IsProjectsNameUniqueForCustomer")]
        public async Task<IActionResult> IsProjectNameUniqueForCustomer([FromQuery] string name, [FromQuery] string customerId, [FromQuery] string? projectId=null )
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            var result = _projectsService.IsProjectNameUniqueForCustomer(currentLoggedInUser, name, customerId,projectId);


            return Ok(new
            {
                res = result
            });
        }



        [Authorize]
        [HttpPost("updateProject")]
        public async Task<IActionResult> UpdateProduct([FromBody] ProjectsDTO projectsDTO)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            if (projectsDTO == null)
            {
                throw new ArgumentNullException("Invalid customer data.");
            }
            _projectsService.UpdateProject(projectsDTO, currentLoggedInUser);
            return Ok(new { Succeeded = true });
        }

        [Authorize]
        [HttpGet("filter")]
        public IActionResult GetFilteredProjects(
            [FromQuery] string? searchTerm,
       [FromQuery] string? sortBy,
       [FromQuery] string? status,
       [FromQuery] string? currency,
       [FromQuery] string? billingType,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }

            if (sortBy == null  && billingType == null && currency == null && status == null &&  searchTerm == null)
            {
                throw new ArgumentNullException("All !!");
            }
            var result = _projectsService.GetFilteredProjects(searchTerm: searchTerm, sortBy: sortBy, billlingType: billingType, status: status, currency: currency, currentLoggedInUser: currentLoggedInUser, page, pageSize);
            return Ok(new
            {
                res = result.Items,
                totalRecords = result.TotalCount,
                pageSize = pageSize
            });

        }


    }
}
