using OpportunityManagement.Data.Repository.Contracts;
using OpportunityManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Data.Repository
{
    public class ContactsRepository :Repository<Contact>, IContactsRepository
    {
        private ApplicationDbContext _db;
        public ContactsRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
    }
}
