using OpportunityManagement.Models;
using OpportunityManagement.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Data.Services.Contracts
{
    public interface IOpportunityService
    {
        public PaginatedResult<OpportunityFormDTO> GetAll(string currentLoggedInUser, int page, int pageSize, string baseUrl);

        public List<OpportunityFormDTO> GetOpportunitiesRelatedToCustomer(string currentLoggedInUser, string customerId);

        public void AddOpportunity(OpportunityFormDTO opportunityFormDTO, string currrentLogedInUser);

        public bool IsOpportunityNameUniqueForCustomer(string currentLoggedInUser, string name, string customerId, string? opportunityId = null);

        public void UpdateOpportunity(OpportunityFormDTO opportunityFormDTO, string currrentLogedInUser);

        public PaginatedResult<OpportunityFormDTO> GetFilteredOpportunities(string? searchTerm,string? sortBy, string? show, string? stage, string? type, string? status, string? location, string? priority,string currentLoggedInUser, int page, int pageSize);
        
        public List<OpportunitySkillsDTO> GetResourcesAndSkills(string opportunityId);

        public void UpdateResourceSkills(GChatMessageDTO messageDTO);

        public Task SendChatMessageAsync(GChatMessageDTO messageDTO);
    }
}
