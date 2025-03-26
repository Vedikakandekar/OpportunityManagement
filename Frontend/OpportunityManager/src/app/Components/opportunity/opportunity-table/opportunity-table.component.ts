import { HttpParams } from '@angular/common/http';
import { ConstantPool } from '@angular/compiler';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, empty, map, Observable, of, switchMap } from 'rxjs';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

import {
  Opportunity,
  OpportunityConfidence,
  OpportunityLocation,
  OpportunityPriority,
  OpportunityStage,
  OpportunityStatus,
  OpportunityType,
  StageSubStageMap,
} from 'src/app/Models/Opportunity';
import { ContactServiceService } from 'src/app/Services/contact-service.service';
import { CustomerServiceService } from 'src/app/Services/customer-service.service';
import { ErrorPopupService } from 'src/app/Services/error-popup.service';
import { OpportunityServiceService } from 'src/app/Services/opportunity-service.service';

declare var bootstrap:any;
@Component({
  selector: 'app-opportunity-table',
  templateUrl: './opportunity-table.component.html',
  styleUrls: ['./opportunity-table.component.css'],
})
export class OpportunityTableComponent implements OnInit, AfterViewInit {
  opportunities: any = [];
  filteredOpportunities: any[] = [];
  editForms: { [key: string]: FormGroup } = {}; // Form for each row
  stageSubstageMap = StageSubStageMap;
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;
  clearFilter: boolean = false;
  selectedCustomerContact : any = null;
  showInfoCard: boolean = false;
  contacts:any[]=[];
  customers:any[];
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  resourceSkillsAssociatedWithOpportunity:any[]=[];
  sortColumn: string | null = null; // Column to sort by
  sortDirection: 'asc' | 'desc' | null = null; // Current sort direction

  isRowEditable : boolean = true;
  showClosureColumns:boolean=false;

  currentDataSource: 'all' | 'searchFilter'  = 'all';
  currentFilters: any = null;

  priorities = Object.values(OpportunityPriority);
  statuses = Object.values(OpportunityStatus);
  types = Object.values(OpportunityType);
  stages = Object.values(OpportunityStage);
  locations = Object.values(OpportunityLocation);
  confidence = Object.values(OpportunityConfidence);

  showConfirmDetails: boolean = false;
  selectedOpportunity: any = null;
  selectedCustomer: any = null;

  constructor(
    private opportunityService: OpportunityServiceService,
    private contactService:ContactServiceService,
    private customerService : CustomerServiceService,
    private errorPopupService : ErrorPopupService,
    private fb: FormBuilder
  ) {}
  ngAfterViewInit(): void {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  ngOnInit(): void {
    this.fetchOpportunities('all', undefined);
    this.fetchContacts();
    this.fetchCustomers();
  }

  sortTable(column: string) {
    if (this.sortColumn === column) {
      // If the same column is clicked, toggle the direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // If a different column is clicked, set to ascending
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredOpportunities.sort((a: any, b: any) => {
      const aValue = this.getNestedValue(a, column);
      const bValue = this.getNestedValue(b, column);
  
      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((value, key) => value && value[key], obj) || '';
  }

  fetchContacts()
  {
    this.contactService.getAllContactsNonPaginated().subscribe({
      next:(res:any)=>
      {
        this.contacts = res;
        console.log("contacts by getAllContacts() ");
        console.log(res);
      },
      error:(err) => console.log(err)
    });  
  }
  fetchCustomers()
  {

    this.customerService.GetAllCustomersNonPaginated().subscribe({
      next:(res:any)=>
      {
        this.customers = res;
        console.log("customers by getAllCustomers() ");
        console.log(res);
      },
      error:(err) => console.log(err)
    });  
  }

  toggleClearFilter() {
    this.clearFilter = !this.clearFilter;
  }

  fetchResourcesAndSkills(opportunityId:string)
  {
    this.opportunityService.getResourcesAndSkills(opportunityId).subscribe({
      next:(res:any)=>
      {
        this.resourceSkillsAssociatedWithOpportunity = res.res;
        console.log("resources and skills: ",res.res);
        this.showConfirmDetails = true;
      },
      error:(err)=>console.log(err)
    });
  }

  initEditForms() {


    this.filteredOpportunities.forEach((opportunity) => {
      const foundStage = Object.keys(StageSubStageMap).find((stage) =>
        StageSubStageMap[stage as OpportunityStage].includes(
          opportunity.substage
        )
      ) as OpportunityStage | undefined;

      if(opportunity.status!="open")
      {
        this.isRowEditable=false;
      }
console.log("is readable: ",this.isRowEditable);
      const formGroup = this.fb.group({
        priority: [opportunity.priority,Validators.required],
        status: [opportunity.status,Validators.required],
        stage: [foundStage || '',Validators.required],
        substage: [opportunity.substage,Validators.required],
        type: [opportunity.type,Validators.required],
        name: [opportunity.name,[Validators.required, 
          Validators.minLength(3),
          Validators.pattern('^[A-Za-z]+( [A-Za-z]+)*$')], [this.uniqueNameValidatorFactory(opportunity.customerId,opportunity.opportunityId)]],
        location: [opportunity.location,Validators.required],
        size: [opportunity.size,[Validators.required,Validators.pattern('^[0-9]+$')]],
        value: [opportunity.value,Validators.required],
        confidence: [opportunity.confidence,Validators.required],
        proposalLink: [opportunity.proposalLink],
        closureReason: [opportunity.closureReason],
        closedDate: [opportunity.closedDate],
        customerId: [opportunity.customerId,Validators.required],
        contactId: [opportunity.contactId,Validators.required],
        customerName: [opportunity.customer.name,Validators.required],
        contactName: [opportunity.contact.name,Validators.required],
        opportunityId: [opportunity.opportunityId,Validators.required],
        age:[opportunity.age,Validators.required],
      });

      formGroup.get('status')?.valueChanges.subscribe((newStatus) => {
      
        this.handleStatusChange(formGroup, newStatus);
      });

  
      formGroup
      .get('size')
      ?.statusChanges.pipe() // Prevent multiple calls
      .subscribe((status) => {
        
        if (status === 'INVALID' && (formGroup.get('size')?.touched || formGroup.get('size').dirty)) {
          this.showErrorPopup("Size must be a valid number ");
        }
      });

      formGroup
      .get('name')
      ?.statusChanges.pipe() // Prevent multiple calls
      .subscribe((status) => {
        const control = formGroup.get('name');
        if (status === 'INVALID' && (formGroup.get('name')?.touched || formGroup.get('name').dirty)) {
          if (control.errors) {
            if (control.errors['required']) {
              this.showErrorPopup("Opportunity name is required!");
            } else if (control.errors['minlength']) {
              this.showErrorPopup("Opportunity name must contain at least 3 letters!");
            } else if (control.errors['pattern']) {
              this.showErrorPopup("Opportunity name should contain only letters and single spaces!");
            } else if (control.errors['nameTaken']) {
              this.showErrorPopup("Opportunity name is already taken for this customer!");
            }
          }
        }
      });

      this.editForms[opportunity.opportunityId] = formGroup;
    });
    Object.values(this.editForms).forEach(form => form.updateValueAndValidity());
  }

  
  uniqueNameValidatorFactory(customerId: string, opportunityId?: string) {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || control.value.trim() === '') {
        return of(null); // No validation if the field is empty (handled by required validator)
      }
      return this.opportunityService
      .IsOpportunityNameUniqueForCustomer(control.value.trim(), customerId, opportunityId)
      .pipe(
        debounceTime(500), // Add debounce to prevent excessive API calls
        distinctUntilChanged(),
        map((isUnique: boolean) => (isUnique ? null : { nameTaken: true })),
        catchError(() => of(null)) // Handle API errors gracefully
      );
  };
  }

  
  handleStatusChange(formGroup: FormGroup, newStatus: string) {
    const closureReasonControl = formGroup.get('closureReason');
    const closedDateControl = formGroup.get('closedDate');
  
    if (newStatus === OpportunityStatus.ClosedWon) {
      // If status is "ClosedWon", set closure reason to "Won the opportunity"
      closureReasonControl?.setValue('Won the opportunity');
    } else if (newStatus !== OpportunityStatus.Open) {
      // If status is anything other than Open/ClosedWon, ask for a reason
      this.askForClosureReason().then((reason) => {
        if (reason.trim()) {
          closureReasonControl?.setValue(reason);
        } else {
          alert("Closure reason is required! Reverting status to Open.");
          formGroup.get('status').setValue(OpportunityStatus.Open);
        }
      });
    }
    if (newStatus !== OpportunityStatus.Open ) {
      // Set closed date to today if status is not Open
      closedDateControl?.setValue(new Date().toISOString().split('T')[0]);
    } else {
      // If status is Open, reset closure reason and closed date
      closureReasonControl?.setValue('');
      closedDateControl?.setValue(null);
    }
  }

  askForClosureReason(): Promise<string> {
  return new Promise((resolve) => {
    const reason = prompt('Enter closure reason:'); // Simple popup for now
    resolve(reason || ''); // If user cancels, return empty string
  });
}

  

  onStageChange(opportunityId: string) {
  
    const stage = this.editForms[opportunityId].get('stage')?.value;
    const substageControl = this.editForms[opportunityId].get('substage');

    if (stage && this.stageSubstageMap[stage].length > 0) {
      substageControl?.setValue(this.stageSubstageMap[stage][0]); // Default to first substage
    } else {
      substageControl?.setValue(''); // Clear substage if no options
    }

    // Show confirm details modal when stage changes to Proposal
    if (stage === OpportunityStage.Proposal) {
      this.fetchResourcesAndSkills(opportunityId);
      this.selectedOpportunity = this.opportunities.find(o => o.opportunityId === opportunityId);
      this.selectedCustomer = this.selectedOpportunity?.customer;
    }
  }

  handleConfirmDetailsClose() {
    this.showConfirmDetails = false;
    this.selectedOpportunity = null;
    this.selectedCustomer = null;
  }

  handleConfirmDetailsSubmit(details: any) {
    console.log('Confirm details submitted:', details);
    // Handle the submitted details here

    this.opportunityService.sendGChatMessage(details).subscribe({
      next:(res:any)=>
      {
        console.log("gchat message sent: ",res);
      },
      error:(err)=>console.log(err)
      
    });
    this.showConfirmDetails = false;
    this.selectedOpportunity = null;
    this.selectedCustomer = null;
  }

  saveOpportunity(opportunityId: string) {

    const form = this.editForms[opportunityId];

    
    if (form.pristine) {
      console.log("No changes detected, skipping save.");
      return; // Exit the function early
    }
    let validationErrors = [];
    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      if (control?.invalid && (control.dirty || control.touched)) {
        const errors = control.errors;
        let errorMessage = `${field} is invalid: `;
  
        if (errors) {
          if (errors['required']) {
            errorMessage += "This field is required.";
          } else if (errors['minlength']) {
            errorMessage += `Minimum length should be ${errors['minlength'].requiredLength} characters.`;
          } else if (errors['pattern']) {
            errorMessage += "Invalid format.";
          } else if (errors['nameTaken']) {
            errorMessage += "This name is already taken.";
          }
          validationErrors.push(errorMessage);
      }
      if (validationErrors.length > 0) {
        this.showErrorPopup(validationErrors.join("\n"));
        return;
      }
        return;
      }
    });
    form.updateValueAndValidity({ onlySelf: true });

    setTimeout(() => {
    if(this.editForms[opportunityId].valid)
    {
      const updatedValues = this.editForms[opportunityId].value;
      console.log("updated values after save : ",updatedValues);
      this.opportunityService.editOpportunity(updatedValues).subscribe({
        next: (res) => {
          console.log('Updated Successfully', res);
          if(!this.currentFilters)
          {
            this.fetchOpportunities('all', undefined); // Refresh table after update
          }
       else
       {
        this.fetchOpportunities(undefined, this.currentFilters); // Refresh table after update
       }
        },
        error: (err) => {
          console.error('Error updating opportunity', err);
        },
      });
    }
    else{
      let invalidFields: string[] = [];
      Object.keys(this.editForms[opportunityId].controls).forEach((field) => {
        const control = this.editForms[opportunityId].get(field);
        if (control?.invalid) {
          invalidFields.push(`${field}: ${control.value}`); // Store the invalid field name
        }
      });
    
      // Show error message with invalid fields
      this.showErrorPopup(`Invalid data is added. Please check: ${invalidFields.join(", ")}`);
    }
  }, 500);
    
  }

  showErrorPopup(fieldName:string)
  {
    this.errorPopupService.showErrorPopup(fieldName,"warning");
  }


  showInfo(opportunityId:string)
  {
this.selectedCustomerContact = this.opportunities.find(o=>o.opportunityId==opportunityId)
if(this.selectedCustomerContact==null)
{
  return;
}
this.showInfoCard = true;
  }


  closeCard() {
    this.showInfoCard = false;
  }

  fetchOpportunities(all?: any, filters?: any) {
    if (!all  && !filters) {
      all = 'all';
    }
    if (all === 'all') {
      this.opportunityService
        .getAllOpportunities(this.currentPage, this.pageSize)
        .subscribe({
          next: (result: any) => {
            console.log('Opportunities in onInit ');
            console.log(result.res);
            this.currentDataSource = 'all';
            this.opportunities = result.res;
            this.totalRecords = result.totalRecords;
            this.filteredOpportunities = result.res;
            this.initEditForms();
          },
        });
    } else if ( filters) {
      if (
        filters['searchTerm']?.trim().length != 0 ||
        filters['sortBy'] ||
        filters['show'] ||
        filters['stage'] ||
        filters['type'] ||
        filters['status'] ||
        filters['location'] ||
        filters['priority']
      ) {
        this.opportunityService
          .filterOpportunity(
            this.currentPage,
            this.pageSize,
            filters
          )
          .subscribe({
            next: (result: any) => {
              console.log('Filtered Opportunities: ', result);
              this.currentDataSource = 'searchFilter';
            
              this.currentFilters = filters;
              this.filteredOpportunities = result.res;
              this.totalRecords = result.totalRecords; // Update filtered data
              console.log('status value: ', filters);
              if(filters.status)
              {
                this.showClosureColumns=true;
              }
              this.editForms = {};
              this.initEditForms(); // Reinitialize forms with new data
            },
            error: (err) => console.log('Search Error: ', err),
          });
      } else {
        // If search term is empty, reset to full opportunity list
        this.errorPopupService.showErrorPopup("All filters are empty : ","warning");
        this.filteredOpportunities = [...this.opportunities];
        this.initEditForms();
      }
    }
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
      this.fetchOpportunities('all', undefined);
    } else if (this.currentDataSource === 'searchFilter') {
      this.fetchOpportunities(
        undefined,
        this.currentFilters
      );
    }
  }
}
