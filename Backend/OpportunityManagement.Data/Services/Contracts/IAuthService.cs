using Microsoft.AspNetCore.Identity;
using OpportunityManagement.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Data.Services.Contracts
{
    public interface IAuthService
    {
        public Task<IdentityResult> RegisterUser(UserRegistrationDTO userRegistrationModel, string? imageUrl);

        public  Task<string?> SignIn(UserLoginDTO loginModel);
    }
}
