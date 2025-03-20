using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace OpportunityManagement.Models
{
    public class AppUser:IdentityUser
    {
        public string FullName { get; set; }

        public string profileImageUrl { get; set; }

        [JsonIgnore]
        public virtual List<Customer> CustomerList { get; set; } = new List<Customer>();   
    }
}
