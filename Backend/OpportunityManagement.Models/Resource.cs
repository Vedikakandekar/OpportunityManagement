using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Models
{
    public class Resource
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string ResourceName { get; set; }

        [Required]
        public string SkillId { get; set; }

        public int Rate { get; set; }

        [ForeignKey("SkillId")]
        public Skills Skills { get; set; }


        public string? ProjectId { get; set; }

        [ForeignKey("ProjectId")]
        public Project? Project { get; set; }

        public DateTime modifiedDate { get; set; }

        public DateTime addedDate { get; set; }

    }
}
