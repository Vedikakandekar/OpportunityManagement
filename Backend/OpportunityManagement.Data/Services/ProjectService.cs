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
using OpportunityManagement.Data.Repository;

namespace OpportunityManagement.Data.Services
{
    public class ProjectService : IProjectService
    {
        public readonly IProjectsRepository projectsRepository;

        public readonly IResourceRepository resourceRepository;

        public readonly ISkillsRepository skillsRepository;

        public readonly IProjectStatusRepository projectStatusRepository;

        public readonly ICustomerRepository _customerRepo;
        public readonly IContactsRepository _contactsRepository;






        public ProjectService(
            
            IProjectsRepository repo,
            ISkillsRepository skillsRepo,
            IResourceRepository resourcessRepo,
            IProjectStatusRepository statusRepository,
            ICustomerRepository customerRepository,
            IContactsRepository contactRepo
         )
        {
            projectStatusRepository = statusRepository;
            projectsRepository = repo;
            resourceRepository = resourcessRepo;
            skillsRepository = skillsRepo;
            _customerRepo= customerRepository;
            _contactsRepository= contactRepo;
        }

        public void AddProject(Project project,string currentLoggedInUser)
        {
            if (project == null || string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new InvalidOperationException("Something went wrong");
            }

            if(_customerRepo.Get(c=>c.Id==project.CustomerId) == null)
            {
                throw new InvalidOperationException("Customer does not exists !!");
            }

            if (_contactsRepository.Get(c => c.Id == project.ContactId) == null)
            {
                throw new InvalidOperationException("COntact does not exists !!");
            }
            projectsRepository.Add(project);
            projectsRepository.Save();
        }

        public PaginatedResult<ProjectsDTO> GetAll(string currentLoggedInUser, int page, int pageSize)
        {

            var query = projectsRepository
                .GetAll(o => o.Customer.AppUserId == currentLoggedInUser ,
                includeProperties: "Contact,Customer,ProjectStatus")
                .AsNoTracking()
                .OrderByDescending(o => o.ModifiedDate)
                .Select(item => new ProjectsDTO
                {
                    projectId = item.Id,
                    projectName = item.ProjectName,
                    billingType = item.BillingType,
                    customerId = item.Customer.Id,
                    contactId = item.Contact.Id,
                    currency = item.Currency,
                    status = item.ProjectStatus.StatusLevel,
                    customerName = item.Customer.Name,
                    contactName = item.Contact.Name,
                });

            int totalCount = query.Count();
            var items = query.Skip((page - 1) * pageSize).Take(pageSize).ToList();

   
           
            return new PaginatedResult<ProjectsDTO>
            {
                Items = items,
                TotalCount = totalCount
            };

        }


        public bool IsProjectNameUniqueForCustomer(string currentLoggedInUser, string name, string customerId, string? projectId = null)
        {
            if (string.IsNullOrWhiteSpace(name)) return false;
            if (string.IsNullOrWhiteSpace(customerId)) throw new Exception("Selected Customer not found !!");

            var existingOpportunity = projectsRepository.Get(o =>
              o.Customer.AppUserId == currentLoggedInUser &&
              o.Customer.Id == customerId &&
              o.ProjectName.ToLower() == name.ToLower() &&
              (projectId == null || o.Id != projectId), // Exclude current record
              includeProperties: "Contact,Customer,ProjectStatus");

            return existingOpportunity == null;
        }

        public void UpdateProject(ProjectsDTO projectsDTO, string currrentLogedInUser)
        {

            Project project = projectsRepository.Get(o => o.Id == projectsDTO.projectId,
                includeProperties: "Customer,ProjectStatus");
            if (project == null)
            {
                throw new InvalidOperationException("Project with Id not found !!");
            }
            if (project.Customer.AppUserId != currrentLogedInUser)
            {
                throw new UnauthorizedAccessException("User is not authorized to update Project!!");
            }


            int statusId = projectStatusRepository.Get(c => c.StatusLevel == projectsDTO.status)?.Id
                   ?? throw new InvalidOperationException("Invalid Status.");


            project.ProjectName = projectsDTO.projectName;
            project.BillingType = projectsDTO.billingType;
            project.Currency = projectsDTO.currency;
            project.ProjectStatusId = statusId;

            project.ModifiedDate = DateTime.Now;
            projectsRepository.Update(project);
            projectsRepository.Save();
        }


        public PaginatedResult<ProjectsDTO> GetFilteredProjects(string? searchTerm, string? sortBy, string? billlingType, string? status, string? currency, string currentLoggedInUser, int page, int pageSize)
        {
            var query = projectsRepository.GetAll(o => o.Customer.AppUserId == currentLoggedInUser, includeProperties: "Contact,Customer,ProjectStatus").AsQueryable();

            int statusId = projectStatusRepository.Get(c => c.StatusLevel == status)?.Id
                   ?? 0;

            query = query.Where(o =>
               (searchTerm == null || EF.Functions.Like(o.ProjectName, $"%{searchTerm}%"))
                && (status == null || o.ProjectStatusId == statusId)
                && (billlingType == null || o.BillingType == billlingType)
                && (currency == null || o.Currency == currency)
                );

            if (!string.IsNullOrEmpty(sortBy))
            {
                query = sortBy switch
                {
                    "name" =>
                        query = query.OrderBy(o => o.ProjectName),

                    "dateAdded" =>
                        query = query.OrderBy(o => o.AddedDate),

                    "dateModified" =>
                       query = query.OrderByDescending(o => o.ModifiedDate),

                    _ => query
                };
            }
            int totalCount = query.Count();
            var items = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(item => new ProjectsDTO
                {
                    projectId = item.Id,
                    projectName = item.ProjectName,
                    currency = item.Currency,
                    billingType = item.BillingType,
                    customerId = item.CustomerId,
                    contactId = item.ContactId,
                    status = item.ProjectStatus.StatusLevel,
                    customerName = item.Customer.Name,
                    contactName = item.Contact.Name,
                }).ToList();


            return new PaginatedResult<ProjectsDTO>
            {
                Items = items,
                TotalCount = totalCount
            };


        }
    }
}
