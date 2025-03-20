using Microsoft.EntityFrameworkCore;
using OpportunityManagement.Data.Repository;
using OpportunityManagement.Data.Repository.Contracts;
using OpportunityManagement.Data.Services.Contracts;
using OpportunityManagement.Models;
using OpportunityManagement.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace OpportunityManagement.Data.Services
{
    public class ContactService : IContactService
    {
        public readonly IContactsRepository contactsRepository;
        public readonly ICustomerRepository customerRepository;
        public ContactService(IContactsRepository service,ICustomerRepository _customerRepository)
        {
            contactsRepository = service;
            customerRepository = _customerRepository;
        }

        public void AddContact(ContactsPageDTO contactsPageDTO, string currentLoggedInUser)
        {
            if(customerRepository.Get(c=>c.Id==contactsPageDTO.CustomerId) == null)
            {
                throw new InvalidOperationException("Invalid Customer selected !!");
            }
            if (contactsRepository.Get(c => c.Email == contactsPageDTO.Email) != null)
            {
                throw new InvalidOperationException("Contact with given Email already exists !!");
            }
            Contact newContact = new Contact
            {
                Email = contactsPageDTO.Email,
                CustomerId = contactsPageDTO?.CustomerId ?? throw new InvalidOperationException("Invalid Customer Selected !!"),
                Designation = contactsPageDTO.Designation,
                Mobile = contactsPageDTO.Mobile,
                Name = contactsPageDTO.Name,
                ModifiedDate = DateTime.Now,
                profileImageUrl =contactsPageDTO.profileImageUrl
            };
            contactsRepository.Add(newContact);
            contactsRepository.Save();
        }


        public List<ContactsPageDTO> GetContactsRelatedToCustomer(string currentLoggedInUser, string customerId)
        {
            if (customerRepository.Get(c => c.Email == customerId) == null)
            {
                throw new InvalidOperationException("Customer does not exist !!");
            }
            var opportunityList = contactsRepository.GetAll(o => o.Customer.Email == customerId, includeProperties: "Customer")
                .Select(o => new ContactsPageDTO
                {
                    Name = o.Name,
                    Designation = o.Designation,
                    Email = o.Email,
                    Mobile = o.Mobile,
                    
                }).ToList();
            return opportunityList;
        }

        public PaginatedResult<ContactsPageDTO> GetContactsDetails(string currentLoggedInUser, int page, int pageSize)
        {
          var contactsList = contactsRepository.GetAll(c=>c.Customer.AppUserId == currentLoggedInUser,includeProperties: "Customer")
                .AsNoTracking()
                .OrderByDescending(c => c.ModifiedDate);
          
            int totalCount = contactsList.Count();
            var items = contactsList.Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(contact => new ContactsPageDTO
                {
                    ContactId = contact.Id,
                    CustomerId = contact.CustomerId,
                    CustomerName = contact.Customer.Name,
                    Designation = contact.Designation,
                    Email = contact.Email,
                    Mobile = contact.Mobile,
                    Name = contact.Name,
                    profileImageUrl = contact.profileImageUrl
                })
                .ToList();

            return new PaginatedResult<ContactsPageDTO>
            {
                Items = items,
                TotalCount = totalCount
            };
        }


        public List<ContactsPageDTO> GetContactsDetailsNonPaginated(string currentLoggedInUser)
        {
            List<Contact> contactsList = contactsRepository.GetAll(c => c.Customer.AppUserId == currentLoggedInUser, includeProperties: "Customer").ToList();

            List<ContactsPageDTO> contactsPageDTOs = contactsList.Select(contact => new ContactsPageDTO
            {
                ContactId = contact.Id,
                CustomerId = contact.CustomerId,
                CustomerName = contact.Customer.Name,
                Designation = contact.Designation,
                Email = contact.Email,
                Mobile = contact.Mobile,
                Name = contact.Name

            })
                .ToList();

            return contactsPageDTOs;
        }

        public PaginatedResult<ContactsPageDTO> searchContact(string searchTerm, string currentLoggedInUser, int page, int pageSize)
        {
            var query = contactsRepository.GetAll(c => c.Customer.AppUserId == currentLoggedInUser,includeProperties:"Customer").AsQueryable();
            if (!string.IsNullOrEmpty(searchTerm))
                query = query
                    .Where(o => EF.Functions.Like(o.Name, $"%{searchTerm}%") ||
                    EF.Functions.Like(o.Email, $"%{searchTerm}%") ||
                    EF.Functions.Like(o.Designation, $"%{searchTerm}%") ||
                    EF.Functions.Like(o.Mobile, $"%{searchTerm}%") ||
                    EF.Functions.Like(o.Customer.Name, $"%{searchTerm}%"));

            int totalCount = query.Count();
            var items = query.Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(contact => new ContactsPageDTO
                {
                    ContactId = contact.Id,
                    CustomerId = contact.CustomerId,
                    CustomerName = contact.Customer.Name,
                    Designation = contact.Designation,
                    Email = contact.Email,
                    Mobile = contact.Mobile,
                    Name = contact.Name,
                    profileImageUrl = contact.profileImageUrl
                })
                .ToList();
                
            return new PaginatedResult<ContactsPageDTO>
            {
                Items = items,
                TotalCount = totalCount
            };
        }

        public void updateContact(ContactsPageDTO contactDTO, string currentLoggedInUser)
        {
            Contact contact = contactsRepository.Get(c => c.Email == contactDTO.Email, includeProperties: "Customer");
            if (contact.Customer.AppUserId != currentLoggedInUser)
            {
                throw new Exception("Something Went Wrong, contact not found !!");
            }
            contact.Name = contactDTO.Name;
            contact.Mobile = contactDTO.Mobile;
            contact.Designation = contactDTO.Designation;
            contact.ModifiedDate = DateTime.Now;
            contactsRepository.Update(contact);
            contactsRepository.Save();
        }


    }
}
