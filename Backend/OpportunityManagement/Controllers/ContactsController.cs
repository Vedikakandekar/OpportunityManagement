using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpportunityManagement.Data.Services;
using OpportunityManagement.Data.Services.Contracts;
using OpportunityManagement.Models.DTOs;

namespace OpportunityManagement.Controllers
{
    [Route("api/Contacts")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly IContactService contactService;
        public ContactsController(IContactService service)
        {
            contactService = service;
        }

        [HttpGet("GetContactsRelatedToCustomer")]
        public async Task<IActionResult> GetOpportunitiesRelatedToCustomer([FromQuery] string customerId)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            var result = contactService.GetContactsRelatedToCustomer(currentLoggedInUser, customerId);

            return Ok(new
            {
                res = result
            });
        }


        [Authorize]
        [HttpGet("getAllContacts")]
        public async Task<IActionResult> getAllContacts([FromQuery] int page = 1,
        [FromQuery] int pageSize = 5)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            var result = contactService.GetContactsDetails(currentLoggedInUser,page,pageSize);
            string baseUrl = $"{Request.Scheme}://{Request.Host}";
            var modifiedItems = result.Items.Select(c => new
            {
                c.ContactId,
                c.Designation,
                c.Name,
                c.Email,
                c.Mobile,
                c.CustomerId,
                c.CustomerName,
                profileImageUrl = string.IsNullOrEmpty(c.profileImageUrl) ? $"{baseUrl}/Images/Profile/default.jpg" : $"{baseUrl}{c.profileImageUrl}"
            }).ToList();
            return Ok(new
            {
                res = modifiedItems,
                totalRecords = result.TotalCount,
                pageSize = pageSize
            });
        }

        [Authorize]
        [HttpGet("getAllContactsNonPaginated")]
        public async Task<IActionResult> getAllContactsNonPaginated()
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            var result = contactService.GetContactsDetailsNonPaginated(currentLoggedInUser);
            return Ok(result);
        }


        [Authorize]
        [HttpGet("search")]
        public async Task<IActionResult> SearchCustomers([FromQuery] string searchTerm, [FromQuery] int page = 1,
[FromQuery] int pageSize = 10)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            var result = contactService.searchContact(searchTerm, currentLoggedInUser, page, pageSize);
            return Ok(new
            {
                res = result.Items,
                totalRecords = result.TotalCount,
                pageSize = pageSize
            });
        }

        [Authorize]
        [HttpPost("addContact")]
        public async Task<IActionResult> addContact([FromForm] ContactsPageDTO contactDTO)
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

            contactDTO.profileImageUrl = imagePath;
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            contactService.AddContact(contactDTO ,currentLoggedInUser);
            return Ok(new {succeeded = true});
        }

        [Authorize]
        [HttpPost("updateContact")]
        public async Task<IActionResult> updateContact([FromBody] ContactsPageDTO contactsPageDTO)
        {
            string currentLoggedInUser = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(currentLoggedInUser))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }
            if (contactsPageDTO == null)
            {
                throw new ArgumentNullException("Invalid contact data.");
            }
            contactService.updateContact(contactsPageDTO, currentLoggedInUser);
            return Ok(new { succeeded = true });
        }

    }
}
