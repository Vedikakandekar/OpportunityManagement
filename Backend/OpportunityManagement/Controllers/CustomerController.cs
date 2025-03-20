using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpportunityManagement.Data.Services.Contracts;
using OpportunityManagement.Models;
using OpportunityManagement.Models.DTOs;
using System.Security.Claims;

namespace OpportunityManagement.Controllers
{
    [Route("api/Customer")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;
        private readonly UserManager<AppUser> userManager;
        public CustomerController(ICustomerService customerService, UserManager<AppUser> userman)
        {
            _customerService = customerService;
            userManager = userman;
        }

        [Authorize]
        [HttpPost("addCustomer")]
        public async Task<IActionResult> AddCustomer([FromForm] CustomerDTO customerDTO)
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
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            if (customerDTO == null)
            {
                throw new ArgumentException("customer data cannot be empty");
            }
            customerDTO.profileImageUrl = imagePath;
            _customerService.addCustomer(customerDTO, currentLoggedInUser);
            return Ok(new {Succeeded= true});
        }


        [Authorize]
        [HttpGet("getAllCustomers")]
        public async Task<IActionResult> GetAllCustomers([FromQuery] int page = 1,
        [FromQuery] int pageSize = 5)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            string baseUrl = $"{Request.Scheme}://{Request.Host}";
            var result = _customerService.getAllCustomers(currentLoggedInUser,page,pageSize);
            return Ok(new
            {
                res = result.Items,
                totalRecords = result.TotalCount,
                pageSize = pageSize
            });
        }

        [Authorize]
        [HttpGet("getAllCustomersNonPaginated")]
        public async Task<IActionResult> GetAllCustomersNonPaginated()
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            var result = _customerService.getAllCustomersNonPaginated(currentLoggedInUser);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("search")]
        public async Task<IActionResult> SearchCustomers([FromQuery] string searchTerm, [FromQuery] int page = 1,
        [FromQuery] int pageSize = 5)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            string baseUrl = $"{Request.Scheme}://{Request.Host}";
            var result = _customerService.searchCustomer(searchTerm,currentLoggedInUser,page,pageSize);
         
            return Ok(new
            {
                res = result.Items,
                totalRecords = result.TotalCount,
                pageSize = pageSize
            });
        }

        [Authorize]
        [HttpPost("updateCustomer")]
        public async Task<IActionResult> updateCustomer([FromBody] CustomerDTO customerDTO)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            if (customerDTO == null)
            {
                throw new ArgumentNullException("Invalid customer data.");
            }
            _customerService.updateCustomer(customerDTO, currentLoggedInUser);
            return Ok(new { succeeded = true });
        }

    }
}
