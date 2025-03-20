using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace OpportunityManagement.Models
{
    public class Stage
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string Name { get; set; }

        
        [JsonIgnore] 
        public virtual List<SubStage> SubStages { get; set; } = new List<SubStage>();
    }
}
