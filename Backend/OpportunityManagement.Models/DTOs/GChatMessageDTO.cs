using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Models.DTOs
{
    public class GChatMessageDTO
    {
        public string comments {  get; set; }

        public string customerName { get; set; }

        public string details { get; set; }

        public string opportunityName { get; set; }

        public List<OpportunitySkillsDTO> opportunitySkills { get; set; }

        public int valuation { get; set; }


    }
}
