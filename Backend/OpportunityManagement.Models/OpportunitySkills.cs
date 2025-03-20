using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Models
{
    public class OpportunitySkills
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();


        [Required]
        public string SkillId { get; set; }


        [ForeignKey("SkillId")]
        public Skills Skills { get; set; }


        [Required]
        public string OpportunityId { get; set; }


        [ForeignKey("OpportunityId")]
        public Opportunity Opportunity { get; set; }


        public int? NumberOfPeople { get; set; }

        public int? RequiredExperience { get; set; }

        public int? Rate { get; set; }

    }
}
