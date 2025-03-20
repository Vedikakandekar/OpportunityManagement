using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Models.DTOs
{
    public class OpportunitySkillsDTO
    {
        public string? skillName { get; set; }

        public int? numberOfPeople { get; set; }

        public int? yearsOfExperience { get; set; }

        public int? Rate { get; set; }
    }
}
