using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Models
{


    public class OpportunityStatusModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string StatusName { get; set; } = string.Empty;
    }

}
