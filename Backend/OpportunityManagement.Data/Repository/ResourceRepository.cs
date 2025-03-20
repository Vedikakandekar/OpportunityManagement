using OpportunityManagement.Data.Repository.Contracts;
using OpportunityManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Data.Repository
{
    public class ResourceRepository : Repository<Resource>, IResourceRepository
    {
        private ApplicationDbContext _db;
        public ResourceRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
    }
}
