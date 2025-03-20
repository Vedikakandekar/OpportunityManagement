using Microsoft.EntityFrameworkCore;
using OpportunityManagement.Data.Repository.Contracts;
using OpportunityManagement.Models.DTOs;
using OpportunityManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpportunityManagement.Data.Services.Contracts;

namespace OpportunityManagement.Data.Services
{
    public class SkillsService : ISkillsService
    {
        public readonly ISkillsRepository skillsRepository;
        public readonly IResourceRepository resourceRepository;



        public SkillsService(ISkillsRepository repo, IResourceRepository resourceRepository)
        {
            skillsRepository = repo;
            this.resourceRepository = resourceRepository;
        }
        public void addSkill(string skillName, string currentLoggedInUser)
        {
            Skills s = new Skills();
            s.SkillName = skillName;
            skillsRepository.Add(s);
            skillsRepository.Save();
        }

        public PaginatedResult<Skills> searchSkill(string searchTerm, string currentLoggedInUser, int page, int pageSize)
        {
            var query = skillsRepository.GetAll().AsQueryable();
            if (!string.IsNullOrEmpty(searchTerm))
                query = query.Where(o => EF.Functions.Like(o.SkillName, $"%{searchTerm}%")) ;


            int totalCount = query.Count();
            var items = query.Skip((page - 1) * pageSize).Take(pageSize);

            return new PaginatedResult<Skills>
            {
                Items = items.ToList(),
                TotalCount = totalCount
            };
        }

        public PaginatedResult<Skills> getAllSkills(string currentLoggedInUser, int page, int pageSize)
        {
           
            var items = skillsRepository
                .GetAll().
               AsQueryable();
            int totalCount = items.Count();
            items = items.Skip((page - 1) * pageSize).Take(pageSize);

            return new PaginatedResult<Skills>
            {
                Items = items.ToList(),
                TotalCount = totalCount
            };
        }

        public List<Skills> getAllSkillsNonPaginated(string currentLoggedInUser)
        {
            var items = skillsRepository.GetAll().AsQueryable();
            return items.ToList();

        }

        public void updateSkill(SkillsDTO skill, string currentLoggedInUser)
        {
            Skills s = skillsRepository.Get(c => c.Id == skill.Id);
            if (skill == null)
            {
                throw new InvalidOperationException("Skill with given information does not exists !!");
            }
            s.SkillName = skill.SkillName;
            skillsRepository.Update(s);
            skillsRepository.Save();
        }

        public void deleteSkill(string skillId, string currentLoggedInUser)
        {
            Skills s = skillsRepository.Get(c => c.Id == skillId);
            if (s == null)
            {
                throw new InvalidOperationException("Skill with given information does not exists !!");
            }
            if(resourceRepository.GetAll(r=>r.SkillId==s.Id).ToList().Count > 0)
            {
                throw new Exception("Cannot Delete Skill, it assigned to resource !!");
            }
            skillsRepository.Remove(s);
            skillsRepository.Save();
        }
    }
}

