

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OpportunityManagement.Models;



namespace OpportunityManagement.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        { }
        public DbSet<AppUser> AppUsers { get; set; }

        public DbSet<Customer> Customers { get; set; }

        public DbSet<Contact> Contacts { get; set; }

        public DbSet<OpportunityTypeModel> OpportunityTypeModels { get; set; }

        public DbSet<OpportunityPriorityLevel> OpportunityPriorityLevels { get; set; }

        public DbSet<OpportunityStatusModel> OpportunityStatusModels{ get; set; }

        public DbSet<OpportunityConfidenceLevel> OpportunityConfidenceLevels { get; set; }

        public DbSet<OpportunityLocationType> OpportunityLocationTypes{ get; set; }

        public DbSet<ProjectStatus> ProjectStatus { get; set; }

        public DbSet<Skills> Skills { get; set; }

        public DbSet<Resource> Resources { get; set; }

        public DbSet<Project> Projects { get; set; }


        public DbSet<OpportunitySkills> opportunitySkills { get; set; }




        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Customer>()
              .HasOne(u => u.AppUser)       
              .WithMany(a => a.CustomerList)
              .HasForeignKey(u => u.AppUserId)
              .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Contact>()
            .HasOne(c => c.Customer)
            .WithMany(cust => cust.ContactsList)
            .HasForeignKey(c => c.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Project>()
       .HasOne(p => p.Opportunity)
       .WithMany()
       .HasForeignKey(p => p.OpportunityId)
       .OnDelete(DeleteBehavior.Restrict);  // Prevents cascade deletion

            modelBuilder.Entity<Project>()
                .HasOne(p => p.Contact)
                .WithMany()
                .HasForeignKey(p => p.ContactId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Project>()
                .HasOne(p => p.Customer)
                .WithMany()
                .HasForeignKey(p => p.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<Project>()
                .HasOne(p => p.ProjectStatus)
                .WithMany()
                .HasForeignKey(p => p.ProjectStatusId)
                .OnDelete(DeleteBehavior.Restrict);

          
        }

    }
}
