using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpportunityManagement.Data.Services.Contracts;
using OpportunityManagement.Models.DTOs;
using OpportunityManagement.Models;

namespace OpportunityManagement.Controllers
{
    [Route("api/Skills")]
    [ApiController]
    public class SkillsController : ControllerBase
    {

        private readonly ISkillsService skillsService;
        private readonly UserManager<AppUser> userManager;
        public SkillsController(ISkillsService service, UserManager<AppUser> userman)
        {
            skillsService = service;
            userManager = userman;
        }

        [Authorize]
        [HttpPost("addSkill")]
        public async Task<IActionResult> AddSkill([FromForm] string SkillName)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            if (SkillName == null)
            {
                throw new ArgumentException("Skills data cannot be empty");
            }
            skillsService.addSkill(SkillName, currentLoggedInUser);
            return Ok(new { Succeeded = true });
        }


        [Authorize]
        [HttpGet("getAllSkills")]
        public async Task<IActionResult> GetAllSkills([FromQuery] int page = 1,
        [FromQuery] int pageSize = 5)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
          
            var result = skillsService.getAllSkills(currentLoggedInUser, page, pageSize);
            return Ok(new
            {
                res = result.Items,
                totalRecords = result.TotalCount,
                pageSize = pageSize
            });
        }

        [Authorize]
        [HttpGet("getAllSkillsNonPaginated")]
        public async Task<IActionResult> GetAllSkillsNonPaginated()
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            var result = skillsService.getAllSkillsNonPaginated(currentLoggedInUser);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("search")]
        public async Task<IActionResult> SearchSkills([FromQuery] string searchTerm, [FromQuery] int page = 1,
        [FromQuery] int pageSize = 5)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            var result = skillsService.searchSkill(searchTerm, currentLoggedInUser, page, pageSize);

            return Ok(new
            {
                res = result.Items,
                totalRecords = result.TotalCount,
                pageSize = pageSize
            });
        }

        [Authorize]
        [HttpPost("updateSkill")]
        public async Task<IActionResult> updateSkill([FromBody] SkillsDTO skill)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            if (skill == null)
            {
                throw new ArgumentNullException("Invalid SKills data.");
            }
            skillsService.updateSkill(skill, currentLoggedInUser);
            return Ok(new { succeeded = true });
        }

        [Authorize]
        [HttpDelete("deleteSkill")]
        public async Task<IActionResult> deleteSkill([FromQuery] string skillId)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            if (skillId == null)
            {
                throw new ArgumentNullException("Invalid SKills data.");
            }
            skillsService.deleteSkill(skillId, currentLoggedInUser);
            return Ok(new { succeeded = true });
        }

    }
}

