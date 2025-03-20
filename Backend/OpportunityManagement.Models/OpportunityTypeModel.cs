using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Models
{
    public enum OpportunityType
    {
        Managed = 1,
        StaffAugmentation = 2
    }

    public class OpportunityTypeModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string TypeName { get; set; } = string.Empty;
    }
}
