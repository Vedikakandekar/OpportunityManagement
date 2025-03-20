using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpportunityManagement.Data.Services;
using OpportunityManagement.Data.Services.Contracts;
using OpportunityManagement.Models.DTOs;

namespace OpportunityManagement.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        [AllowAnonymous]
        [HttpPost("signup")]
        public async Task<IActionResult> RegisterUser([FromForm] UserRegistrationDTO model)
        {
            string imagePath = "";
            var profileImage = Request.Form.Files["profileImage"];
            if (profileImage != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Images/Profile");
                Directory.CreateDirectory(uploadsFolder); // Ensure folder exists

                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(profileImage.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await profileImage.CopyToAsync(stream);
                }

                // Store image path in DB
               imagePath = "/Images/Profile/" + uniqueFileName;
            }

            var result = await _authService.RegisterUser(model,imagePath);
            if (result.Succeeded)
                return Ok(result);

            return BadRequest(result);
        }

        [AllowAnonymous]
        [HttpPost("signin")]
        public async Task<IActionResult> SignIn([FromBody] UserLoginDTO model)
        {
            var token = await _authService.SignIn(model);
            if (token == null)
                return BadRequest(new { message = "Invalid credentials." });

            return Ok(new { token });
        }
    }

}

