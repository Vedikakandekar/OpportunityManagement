using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Models
{
    public enum OpportunityLocation
    {
        Client = 1,
        Hybrid = 2,
        Coditas = 3
    }

    public class OpportunityLocationType
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string LocationType { get; set; } = string.Empty;
    }
}
