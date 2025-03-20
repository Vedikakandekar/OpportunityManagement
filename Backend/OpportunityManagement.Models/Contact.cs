using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace OpportunityManagement.Models
{
    public class Contact
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string Designation { get; set; }

        [Required]
        public string Name { get; set; }


        [Required, EmailAddress]
        public string Email { get; set; }

        [Required, Phone]
        public string Mobile { get; set; }

        [Required]
        public string CustomerId { get; set; }

        [ForeignKey("CustomerId")]
        public Customer Customer { get; set; }

        [Required]
        [JsonPropertyName("modifiedDate")]
        public DateTime ModifiedDate { get; set; }

        public string? profileImageUrl { get; set; }

        [JsonIgnore]
        public virtual List<Opportunity> OpportunitiesList { get; set; } = new List<Opportunity>();
    }

}