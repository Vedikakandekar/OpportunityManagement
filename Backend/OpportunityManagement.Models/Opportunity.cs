using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Models
{
    public class Opportunity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string Name { get; set; }



        [Required]
        public int OpportunityTypeId { get; set; }

        [ForeignKey("OpportunityTypeId")]
        public OpportunityTypeModel Type { get; set; }



        [Required]
        public int OpportunityPriorityId { get; set; }

        [ForeignKey("OpportunityPriorityId")]
        public OpportunityPriorityLevel Priority { get; set; }



        [Required]
        public int OpportunityStatusId { get; set; }

        [ForeignKey("OpportunityStatusId")]
        public OpportunityStatusModel Status { get; set; }


        [Required]
        public int OpportunityLocationId { get; set; }

        [ForeignKey("OpportunityLocationId")]
        public OpportunityLocationType Location { get; set; }
        
        
        
        public int Size { get; set; }
     
        public int Value { get; set; }


        [Required]
        public int OpportunityConfidenceId { get; set; }

        [ForeignKey("OpportunityConfidenceId")]
        public OpportunityConfidenceLevel Confidence { get; set; }


        public DateTime AddedDate { get; set; } = DateTime.UtcNow;

        public int Age { get; set; }

        public DateTime? ClosedDate { get; set; } = null;

        public string? ClosureReason { get; set; } = null;

        public string? ProposalLink { get; set; } = null;

        public DateTime ModifiedDate { get; set; }

        // Foreign Key to Contact
        [Required]
        public string ContactId { get; set; }

        [ForeignKey("ContactId")]
        public Contact Contact { get; set; }

        // Foreign Key to SubStage
        [Required]
        public string SubStageId { get; set; }

        [ForeignKey("SubStageId")]
        public SubStage SubStage { get; set; }
    }
}
