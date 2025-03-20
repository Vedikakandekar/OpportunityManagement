using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Models
{
    public class ProjectStatus
    {

        [Key]
        public int Id { get; set; }

        [Required]
        public string StatusLevel { get; set; }
    }
}
