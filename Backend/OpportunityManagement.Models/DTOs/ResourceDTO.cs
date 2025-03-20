using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Models.DTOs
{
    public class ResourceDTO
    {
        public string? resourceId { get; set; }

        public string resourceName { get; set; }

        public string? skillName { get; set; }

        public string? skillId { get; set; }

        public string? projectId { get; set; }

        public string? projectName { get; set; }
        public int rate { get; set; }
    }
}
