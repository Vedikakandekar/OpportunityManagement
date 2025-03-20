using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Models.DTOs
{
    public class ProjectsDTO
    {
        public string projectId { get; set; }

        public string projectName { get; set; }

        public string? billingType { get; set; }

        public string status { get; set; }

        public string? currency { get; set; }

        public string? customerId { get; set; }

        public string? contactId { get; set; }

        public string? customerName { get; set; }

        public string? contactName { get; set; }

    }
}
