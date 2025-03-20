using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Models.DTOs
{
   public  class OpportunityFormDTO
    {
        public string? opportunityId {  get; set; }
        public string? name { get; set; }=string.Empty;

        public string? priority { get; set; } = string.Empty;

        public string? type { get; set; } = string.Empty;

        public string? location { get; set; } = string.Empty;
            
        public int? size { get; set; } = 0;

        public int? value { get; set; } = 0;

        public string? confidence { get; set; } = string.Empty;

        public string? proposalLink { get; set; }   

        public string? customerId { get; set; } = string.Empty;

        public string? contactId { get; set; } = string.Empty;

        public string? substage { get; set; }

        public string? stage { get; set; }

        public string? status { get; set; }

        public DateTime? closedDate { get; set; }

        public string? closureReason { get; set; }

        public Customer? customer { get; set; }

        public Contact? contact { get; set; }

        public int? age { get; set; }

        public string? profileImageUrl { get; set; }

        public List<OpportunitySkillsDTO>? opportunitySkills { get; set; }

    }
}
