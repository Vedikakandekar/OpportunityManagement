using OpportunityManagement.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Data.Services.Contracts
{
    public interface IResourceService
    {

        public PaginatedResult<ResourceDTO> GetResourceDetails(string currentLoggedInUser, int page, int pageSize);

        public List<ResourceDTO> GetResourceDetailsNonPaginated(string currentLoggedInUser);

        public void AddResource(ResourceDTO contactsPageDTO, string currentLoggedInUser);

        public void AddProjectToResource(string projectId, List<string> resourceId, string currentLoggedInUser);

        public void updateResource(ResourceDTO customerDTO, string currentLoggedInUser);

        public PaginatedResult<ResourceDTO> searchResource(string searchTerm, string currentLoggedInUser, int page, int pageSize);

        public void deleteResource(string resourceId, string currentLoggedInUser);
    }
}
