using OpportunityManagement.Data.Repository.Contracts;
using OpportunityManagement.Data.Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Data.Services
{
    public class SubstageService : ISubstageService
    {

        public readonly ISubstageRepository substageService;
        public SubstageService(ISubstageRepository repo)
        {
            substageService = repo;
        }
    }
}
