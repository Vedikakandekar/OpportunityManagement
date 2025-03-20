using Microsoft.EntityFrameworkCore;
using OpportunityManagement.Data.Repository.Contracts;
using OpportunityManagement.Data.Services.Contracts;
using OpportunityManagement.Models.DTOs;
using OpportunityManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Data.Services
{
    public class ResourceService : IResourceService
    {

        public readonly IResourceRepository resourceRepository;
        public readonly ISkillsRepository skillsRepository;
        public readonly IProjectsRepository projectRepository;
        public ResourceService(IResourceRepository service, ISkillsRepository _skillsRepository, IProjectsRepository projectRepo)
        {
            resourceRepository = service;
            skillsRepository = _skillsRepository;
            projectRepository = projectRepo;
        }

        public void AddResource(ResourceDTO resourceDTO, string currentLoggedInUser)
        {
            var skill = skillsRepository.Get(s => s.Id == resourceDTO.skillId);
            if (skill == null)
            {
                throw new InvalidOperationException("Invalid Skill selected !!");
            }
            if (resourceRepository.Get(c => c.ResourceName == resourceDTO.resourceName) != null)
            {
                throw new InvalidOperationException("Resource with given Name already exists !!");
            }
            Resource newResource = new Resource
            {
                ResourceName = resourceDTO.resourceName,
                SkillId = skill.Id,
                Rate = resourceDTO.rate,
                modifiedDate = DateTime.Now,
                addedDate = DateTime.Now,
            };
            resourceRepository.Add(newResource);
            resourceRepository.Save();
        }

        public void AddProjectToResource(string projectId, List<string> resourceList, string currentLoggedInUser)
        {
            if(projectRepository.Get(p=>p.Id == projectId) == null)
            {
                throw new InvalidOperationException("Selected Project does not exists !!");
            }
            if(resourceList == null || resourceList.Count == 0)
            {
                throw new InvalidOperationException("Resources not found to add in project  !!");
            }
            var oldResourceList = resourceRepository.GetAll(r=>r.ProjectId==projectId).ToList();
            if (oldResourceList != null && oldResourceList.Count() > 0)
            {
                foreach (var resource in oldResourceList)
                {
                    resource.ProjectId = null;
                    resourceRepository.Update(resource);
                 
                }
            }
            var newResources = resourceRepository.GetAll(r => resourceList.Contains(r.Id)).ToList();
              foreach (var resource in newResources)
                {
                    resource.ProjectId = projectId;
                    resourceRepository.Update(resource);
                }

            resourceRepository.Save();

        }

        public PaginatedResult<ResourceDTO> GetResourceDetails(string currentLoggedInUser, int page, int pageSize)
        {
            var resourceList = resourceRepository.GetAll(includeProperties: "Skills")
                  .AsNoTracking()
                  .OrderByDescending(c => c.modifiedDate);

            int totalCount = resourceList.Count();
            var items = resourceList.Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(res => new ResourceDTO
                {
                    resourceId = res.Id,
                    resourceName = res.ResourceName,
                    skillId = res.SkillId,
                    skillName = res.Skills.SkillName,
                    rate = res.Rate,
                    projectId = res.ProjectId ?? null,
                })
                .ToList();

            return new PaginatedResult<ResourceDTO>
            {
                Items = items,
                TotalCount = totalCount
            };
        }


        public List<ResourceDTO> GetResourceDetailsNonPaginated(string currentLoggedInUser)
        {
            List<Resource> resourceList = resourceRepository.GetAll(includeProperties:"Skills").ToList();

            List<ResourceDTO> resourceDTOs = resourceList.Select(res => new ResourceDTO
            {
                resourceId = res.Id,
                resourceName = res.ResourceName,
                skillId =  res.SkillId,
                skillName = res.Skills.SkillName,
                rate = res.Rate,
                 projectId = res.ProjectId ?? null,
            })
                .ToList();

            return resourceDTOs;
        }

        public PaginatedResult<ResourceDTO> searchResource(string searchTerm, string currentLoggedInUser, int page, int pageSize)
        {
            var query = resourceRepository.GetAll().AsQueryable();
            if (!string.IsNullOrEmpty(searchTerm))
                query = query
                    .Where(o => EF.Functions.Like(o.ResourceName, $"%{searchTerm}%") ||
                    EF.Functions.Like(o.Project.ProjectName, $"%{searchTerm}%") ||
                    EF.Functions.Like(o.Skills.SkillName, $"%{searchTerm}%") ||
                    EF.Functions.Like(o.Rate.ToString(), $"%{searchTerm}%") 
                 );

            int totalCount = query.Count();
            var items = query.Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(res => new ResourceDTO
                {
                    resourceId = res.Id,
                    resourceName = res.ResourceName,
                    skillName = res.Skills.SkillName,
                    rate = res.Rate,
                     projectId = res.ProjectId ?? null,
                })
                .ToList();

            return new PaginatedResult<ResourceDTO>
            {
                Items = items,
                TotalCount = totalCount
            };
        }

        public void updateResource(ResourceDTO resourceDTO, string currentLoggedInUser)
        {
            Resource resource = resourceRepository.Get(c => c.ResourceName == resourceDTO.resourceName, includeProperties: "Project,Skills");
            Skills skill = skillsRepository.Get(c => c.Id == resourceDTO.skillId);
            if (skill == null) {
                throw new InvalidOperationException("Selected Skill does not exists");
            }
            resource.ResourceName = resourceDTO.resourceName;
            resource.SkillId = skill.Id;
            resource.Rate = resourceDTO.rate;
            resource.modifiedDate = DateTime.Now;
            resourceRepository.Update(resource);
            resourceRepository.Save();
        }

        public void deleteResource(string resourceId, string currentLoggedInUser)
        {
            Resource s = resourceRepository.Get(c => c.Id == resourceId);
            if (s == null)
            {
                throw new InvalidOperationException("Resource with given information does not exists !!");
            }
            resourceRepository.Remove(s);
            resourceRepository.Save();
        }


    }
}

