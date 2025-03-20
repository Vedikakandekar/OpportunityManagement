using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Models
{
    public class OpportunityPriorityLevel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string PriorityLevel { get; set; } = string.Empty;
    }

    public enum OpportunityPriority
    {
        High = 1,
        Medium = 2,
        Low = 3
    }

}
