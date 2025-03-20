using OpportunityManagement.Data.Repository.Contracts;
using OpportunityManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Data.Repository
{
    public class ProjectStatusRepository : Repository<ProjectStatus>, IProjectStatusRepository
    {
        private ApplicationDbContext _db;
        public ProjectStatusRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
    }
}
