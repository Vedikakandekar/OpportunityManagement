using OpportunityManagement.Data.Repository.Contracts;
using OpportunityManagement.Data.Services.Contracts;
using OpportunityManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Data.Services
{
    public class UserService : IUserService
    {
        public readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepo)
        {
            _userRepository = userRepo;
        }

        public string? getUserProfile(string currentLoggedInUser)
        {
           if(string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("Current User is not authorized !");
            }
           return _userRepository.Get(u=>u.Id == currentLoggedInUser)?.profileImageUrl;
        }
    }
}
