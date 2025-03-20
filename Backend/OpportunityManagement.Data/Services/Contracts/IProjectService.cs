using OpportunityManagement.Models;
using OpportunityManagement.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Data.Services.Contracts
{
    public interface IProjectService
    {
        public PaginatedResult<ProjectsDTO> GetAll(string currentLoggedInUser, int page, int pageSize);

        public void AddProject(Project project, string currrentLogedInUser);

        public bool IsProjectNameUniqueForCustomer(string currentLoggedInUser, string name, string customerId,string? projectId=null);

        public void UpdateProject(ProjectsDTO projectsDTO, string currrentLogedInUser);

        public PaginatedResult<ProjectsDTO> GetFilteredProjects(string? searchTerm, string? sortBy, string? billlingType, string? status, string? currency,string currentLoggedInUser, int page, int pageSize);

    }
}
