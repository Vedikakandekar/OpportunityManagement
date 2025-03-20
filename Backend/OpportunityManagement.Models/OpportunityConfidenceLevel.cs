using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Models
{
    public class OpportunityConfidenceLevel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string ConfidenceLevel { get; set; } = string.Empty;
    }

    public enum OpportunityConfidence
    {
        GuaranteedWin = 1,
        VeryPromising = 2,
        PotentialLead = 3,
        LongShot = 4,
        Unlikely = 5
    }

}
