using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Models
{
    public class Project
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();


        [Required]
        public string ProjectName { get; set; }



        public string? BillingType { get; set; }

        public string? Currency { get; set; }


        [Required]
        public string OpportunityId { get; set; }

        [ForeignKey("OpportunityId")]
        public Opportunity Opportunity { get; set; }


        [Required]
        public string ContactId { get; set; }

        [ForeignKey("ContactId")]
        public Contact? Contact { get; set; }


        [Required]
        public string CustomerId { get; set; }

        [ForeignKey("CustomerId")]
        public Customer? Customer { get; set; }


        [Required]
        public int ProjectStatusId { get; set; }

        [ForeignKey("ProjectStatusId")]
        public ProjectStatus? ProjectStatus { get; set; }


         [Required]
        public DateTime ModifiedDate { get; set; }

        [Required]
        public DateTime AddedDate { get; set; }
    }
}
