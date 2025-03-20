using OpportunityManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Data.Services.Contracts
{
    public interface IUserService 
    {
        public string? getUserProfile(string currentLoggedInUser); 
    }
}
