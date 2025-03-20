using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Models
{
    public enum OpportunityStatus
    {
        Open = 1,
        ClosedWon = 2,
        ClosedLost = 3,
        Dropped = 4,
        OnHold = 5
    }

    public class OpportunityStatusModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string StatusName { get; set; } = string.Empty;
    }

}
