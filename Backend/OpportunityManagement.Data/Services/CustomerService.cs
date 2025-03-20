using Azure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
    public class CustomerService : ICustomerService
    {
        public readonly ICustomerRepository _customerRepository;


        public CustomerService(ICustomerRepository repo)
        {
            _customerRepository = repo;
        }
        public void addCustomer(CustomerDTO customerDTO, string currentLoggedInUser)
        {
           Customer customer = new Customer();
            customer.PhoneNumber = customerDTO.phoneNumber;
            customer.Email = customerDTO.email;
            customer.AppUserId = currentLoggedInUser; ;
            customer.Name = customerDTO.name;
            customer.ModifiedDate = DateTime.Now;
            customer.profileImageUrl = customerDTO.profileImageUrl;
            _customerRepository.Add(customer);
            _customerRepository.Save();
        }

        public PaginatedResult<Customer> searchCustomer(string searchTerm, string currentLoggedInUser, int page, int pageSize)
        {
            var query = _customerRepository.GetAll(c => c.AppUserId == currentLoggedInUser).AsQueryable();
            if (!string.IsNullOrEmpty(searchTerm))
                query = query.Where(o => EF.Functions.Like(o.Name, $"%{searchTerm}%") || EF.Functions.Like(o.Email, $"%{searchTerm}%") || EF.Functions.Like(o.PhoneNumber, $"%{searchTerm}%"));

           
            int totalCount = query.Count();
           var items = query.Skip((page - 1) * pageSize).Take(pageSize);

            return new PaginatedResult<Customer>
            {
                Items = items.ToList(),
                TotalCount = totalCount
            };
        }

        public PaginatedResult<Customer> getAllCustomers(string currentLoggedInUser, int page, int pageSize)
        {
            string baseUrl = "";
            var items = _customerRepository
                .GetAll(c => c.AppUserId == currentLoggedInUser)
                .OrderByDescending(c => c.ModifiedDate).AsQueryable();
            int totalCount = items.Count();
            items = items.Skip((page - 1) * pageSize).Take(pageSize);

            return new PaginatedResult<Customer>
            {
                Items = items.ToList(),
                TotalCount = totalCount
            };
        }

        public  List<Customer> getAllCustomersNonPaginated(string currentLoggedInUser)
        {
            var items = _customerRepository.GetAll(c => c.AppUserId == currentLoggedInUser).AsQueryable();
            return items.ToList();
                
        }

        public void updateCustomer(CustomerDTO customerDTO, string currentLoggedInUser)
        {
            Customer customer = _customerRepository.Get(c => c.Email == customerDTO.email && c.AppUserId == currentLoggedInUser);
            if(customer==null)
            {
                throw new InvalidOperationException("Customer with given information does not exists !!");
            }
            customer.Name = customerDTO.name;
            customer.Email = customerDTO.email;
            customer.PhoneNumber = customerDTO.phoneNumber;
            customer.ModifiedDate = DateTime.Now;
            _customerRepository.Update(customer);
            _customerRepository.Save();
        }
    }
}
