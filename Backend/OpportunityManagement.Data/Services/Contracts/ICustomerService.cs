using OpportunityManagement.Models;
using OpportunityManagement.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Data.Services.Contracts
{
    public interface ICustomerService
    {
        public void addCustomer(CustomerDTO customerDTO, string currentLoggedInUser);

        public PaginatedResult<Customer> getAllCustomers(string currentLoggedInUser, int page, int pageSize);

        public List<Customer> getAllCustomersNonPaginated(string currentLoggedInUser);

        public void updateCustomer(CustomerDTO customerDTO, string currentLoggedInUser);

        public PaginatedResult<Customer> searchCustomer(string searchTerm,string currentLoggedInUser, int page, int pageSize);
    }
}
