using OpportunityManagement.Models;
using OpportunityManagement.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Data.Services.Contracts
{
    public interface IContactService
    {

        public PaginatedResult<ContactsPageDTO> GetContactsDetails(string currentLoggedInUser, int page, int pageSize);

        public List<ContactsPageDTO> GetContactsDetailsNonPaginated(string currentLoggedInUser);

        public List<ContactsPageDTO> GetContactsRelatedToCustomer(string currentLoggedInUser, string customerId);

        public void AddContact(ContactsPageDTO contactsPageDTO,string currentLoggedInUser);

        public void updateContact(ContactsPageDTO customerDTO, string currentLoggedInUser);

        public PaginatedResult<ContactsPageDTO> searchContact(string searchTerm, string currentLoggedInUser, int page, int pageSize);
    }
}
