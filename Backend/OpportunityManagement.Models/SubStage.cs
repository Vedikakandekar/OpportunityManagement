using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Models
{
    public class SubStage
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string Name { get; set; }

        // Foreign Key to Stage
        [Required]
        public string StageId { get; set; }

        [ForeignKey("StageId")]
        public Stage Stage { get; set; }
    }
}
