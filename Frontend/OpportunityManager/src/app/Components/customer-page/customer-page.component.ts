import { Component, OnInit } from '@angular/core';
import { Customer, CustomerData } from 'src/app/Models/Customer';
import { ContactServiceService } from 'src/app/Services/contact-service.service';
import { CustomerServiceService } from 'src/app/Services/customer-service.service';
import { OpportunityServiceService } from 'src/app/Services/opportunity-service.service';

@Component({
  selector: 'app-customer-page',
  templateUrl: './customer-page.component.html',
  styleUrls: ['./customer-page.component.css']
})
export class CustomerPageComponent implements OnInit {

  showModal = false;
  currentDataSource: 'all' | 'search' = 'all';
  currentSearchTerm: string = '';
  filteredCustomers :any[] =[];
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;

  customerTobeEdited:Customer;
  customers : any[] = [];
  customerColumns : any[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Contact' }
 
  ];
  customerData: CustomerData[]=[];
  
  constructor(private customerService:CustomerServiceService, private opportunityService:OpportunityServiceService, private contactService:ContactServiceService){}
  ngOnInit(): void {
   this.fetchCustomers("all",undefined);
  }


  fetchCustomers(all?:any,searchTerm?:string)
  {

    if(!all && !searchTerm)
    {
      all='all';
    }

    if(all==='all')
    {
      this.customerService.GetAllCustomers(this.currentPage, this.pageSize).subscribe({
        next : (result:any)=>
        {
          console.log("Customer Data : ",result.res);
          if(result){
            this.customers = result.res;
            this.customerData = result.res.map(({ id, appUserId, appUser, contactsList, ...rest }) => rest);
           this.filteredCustomers = this.customerData;
            this.currentDataSource = 'all';
            this.totalRecords = result.totalRecords;
          }
        },
        error : (err)=>{
          console.log(err);
        }
       });
    }
    else
    if(searchTerm)
    {

      if(searchTerm?.trim().length != 0)
      {
        console.log("Search Term is: ",searchTerm)
        this.customerService.searchCustomer(searchTerm,this.currentPage,this.pageSize).subscribe(
          {
            next : (result:any)=>
              {
                console.log("Customer Search Data : "+result.res);
                if(result){
                  this.customers = result.res;
                  this.customerData = result.res.map(({ id, appUserId, appUser, contactsList, ...rest }) => rest);
                  this.filteredCustomers = this.customerData;
                  this.currentDataSource = 'search';
                  this.currentSearchTerm = searchTerm;
                  this.totalRecords = result.totalRecords;
                }
              },
              error : (err)=>{
                console.log(err);
              }
             });
          }
          else
          {
            this.filteredCustomers = [...this.customerData];
          }
        
      
    }
  }

  onEdit(customer: any) {
    console.log('Editing Customer:', customer.phoneNumber);
      this.customerTobeEdited = this.customers.find((c)=>c.email==customer.email);
    console.log(this.customerTobeEdited.email,this.customerTobeEdited.name,this.customerTobeEdited.phoneNumber);
    if(this.customerTobeEdited != null)
    {
      this.showModal = true;
    }
  }

  updateUser(updatedData: CustomerData) {
    console.log("Updated User Data:", updatedData);
    this.showModal = false;
    this.customerService.editCustomer(updatedData).subscribe({
      next:(res:any) =>
      {
        if(res.succeeded)
        {
          console.log('Customer Edited SuccessFully:');
        }
      },
      error:(err) => console.log(err)
    });
  }

  
  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchOpportunitiesBasedOnSource();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page
    this.fetchOpportunitiesBasedOnSource();
  }

  fetchOpportunitiesBasedOnSource() {
    if (this.currentDataSource === 'all') {
      this.fetchCustomers('all', undefined);
    } else if (this.currentDataSource === 'search') {
      this.fetchCustomers(
        undefined,
        this.currentSearchTerm,
      );
    }
  }

  showDealsModal = false;
  showContactsModal = false;
  selectedCustomer: any = null;
selectedCustomerName:string="";

  onShowDeals(customer: any) {
    console.log("Customer on show deals: ",customer);
   this.selectedCustomerName = customer.name;
    this.opportunityService.getOpportunitiesRelatedToCustomer(customer.email).subscribe({
      next:(res:any)=>
      {
        console.log("Opportunities Related to Customer: ",res.res);
        this.selectedCustomer = res.res;
        this.showDealsModal = true;
      }
    })
    
  }

  onShowContacts(customer: any) {
    this.contactService.getContactsRelatedToCustomer(customer.email).subscribe({
      next:(res:any)=>
      {
this.selectedCustomerName=customer.name;
        console.log("Contacts Related to Customer: ",res.res);
        this.selectedCustomer = res.res;
        this.showContactsModal = true;
      }
    })
  }

  closeDealsModal() {
    this.showDealsModal = false;
    this.selectedCustomer = null;
  }

  closeContactsModal() {
    this.showContactsModal = false;
    this.selectedCustomer = null;
  }
}
