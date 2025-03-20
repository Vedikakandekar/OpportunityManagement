import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Contacts } from 'src/app/Models/Contacts';
import { Customer } from 'src/app/Models/Customer';
import { ContactServiceService } from 'src/app/Services/contact-service.service';
import { CustomerServiceService } from 'src/app/Services/customer-service.service';

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.css']
})
export class ContactsPageComponent implements OnInit {
 
  showModal = false;

  contactTobeEdited:Contacts;

  constructor(private contactService : ContactServiceService,private customerService : CustomerServiceService){}

  contacts : Contacts[]=[];
  customers : Customer[]=[];
  currentDataSource: 'all' | 'search' = 'all';
  currentSearchTerm: string = '';
  filteredContacts :any[] =[];
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;

  contactsData : any[]=[];
  contactsColumns :  any[] = [
    { key: 'name', label: 'Contact' },
    { key: 'customerName', label: 'Company' },
    { key: 'designation', label: 'Designation' },
    { key: 'email', label: 'Email' },
    { key: 'mobile', label: 'Mobile' }
  ];

  ngOnInit(): void {
  
  this.fetchCustomers();
  this.fetchContacts("all",undefined);

  }

fetchContacts(all?:any,searchTerm?:string)
{
  if(!all && !searchTerm)
    {
      all='all';
    }

    if(all==='all')
    {
      this.contactService.getAllContacts(this.currentPage,this.pageSize).subscribe({
        next : (result : any) =>
        {
          console.log("All contacts : ",result.res);
          this.contacts=result.res;
          this.contactsData = result.res.map(({ contactId, customerId, ...rest }) => rest)
          this.filteredContacts = this.contactsData;
          this.currentDataSource = 'all';
          this.totalRecords = result.totalRecords;
          console.log("ContactsData : ");
          console.log(this.contactsData);
        },
        error : (err) => console.log(err)
      });
    }
    else
    if(searchTerm)
    {
      if(searchTerm?.trim().length != 0)
        {
          this.contactService.searchContact(searchTerm,this.currentPage,this.pageSize).subscribe(
            {
              next : (result:any)=>
                {
                  console.log("Contact Search Data : "+result.res);
                  if(result){
                    this.customers = result.res;
                    this.contactsData = result.res.map(({ id, appUserId, appUser, contactsList, ...rest }) => rest);
                    this.filteredContacts = this.contactsData;
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
              this.filteredContacts = [...this.contactsData];
            }
          
        
      }

    



}


  fetchCustomers()
  {
    this.customerService.GetAllCustomersNonPaginated().subscribe({
      next : (res:Customer[])=>
         {
           console.log(res);
           if(res){
             this.customers = res;
           }
         },
         error : (err)=>{
           console.log(err);
         }
   });
  }

  onEdit(contact:any)
  {
    console.log('Editing Customer:', contact.mobile);
    this.contactTobeEdited = this.contacts.find((c)=>c.email==contact.email);
  console.log(this.contactTobeEdited.email,this.contactTobeEdited.name,this.contactTobeEdited.mobile);
  if(this.contactTobeEdited != null)
  {
    this.showModal = true;
  }
}

  updateUser(updatedData: Contacts) {
    console.log("Updated Contact Data:", updatedData);
    this.showModal = false;
    this.contactService.editContact(updatedData).subscribe({
      next:(res:any) =>
      {
        if(res.succeeded)
        {
          console.log('Contact Edited SuccessFully:');
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
      this.fetchContacts('all', undefined);
    } else if (this.currentDataSource === 'search') {
      this.fetchContacts(
        undefined,
        this.currentSearchTerm,
      );
    }
  }


}
