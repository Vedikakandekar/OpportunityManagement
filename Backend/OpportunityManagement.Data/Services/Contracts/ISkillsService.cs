using OpportunityManagement.Models.DTOs;
using OpportunityManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Data.Services.Contracts
{
    public interface ISkillsService
    {
        public void addSkill(string skillName, string currentLoggedInUser);

        public PaginatedResult<Skills> getAllSkills(string currentLoggedInUser, int page, int pageSize);

        public List<Skills> getAllSkillsNonPaginated(string currentLoggedInUser);

        public void updateSkill(SkillsDTO skillDTO, string currentLoggedInUser);

        public void deleteSkill(string skillId, string currentLoggedInUser);

        public PaginatedResult<Skills> searchSkill(string searchTerm, string currentLoggedInUser, int page, int pageSize);

    }
}
