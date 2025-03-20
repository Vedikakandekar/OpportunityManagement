using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Models.DTOs
{
    public class ContactsPageDTO
    {
        public string? ContactId { get; set; }

        public string Designation { get; set; }

        public string Email { get; set; }

        public string Name { get; set; }

        public string Mobile { get; set; }

        public string? CustomerId { get; set; }

        public string? CustomerName { get; set; }

        public string? profileImageUrl { get; set; }

    }
}
