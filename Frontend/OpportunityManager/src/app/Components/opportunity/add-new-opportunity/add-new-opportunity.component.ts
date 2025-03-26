import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { catchError, debounceTime, distinct, distinctUntilChanged, map, Observable, of, switchMap } from 'rxjs';
import { Contacts } from 'src/app/Models/Contacts';
import { Customer } from 'src/app/Models/Customer';
import { OpportunityConfidence, OpportunityLocation, OpportunityPriority, OpportunityType } from 'src/app/Models/Opportunity';
import { CustomerServiceService } from 'src/app/Services/customer-service.service';
import { OpportunityServiceService } from 'src/app/Services/opportunity-service.service';
import { SkillsServiceService } from 'src/app/Services/skills-service.service';

@Component({
  selector: 'app-add-new-opportunity',
  templateUrl: './add-new-opportunity.component.html',
  styleUrls: ['./add-new-opportunity.component.css']
})
export class AddNewOpportunityComponent implements OnInit {
  @Input() contacts: Contacts[] = [];
  @Input() customers: Customer[] = [];
  @Output() ReloadOpportunities: any = new EventEmitter<boolean>();
  
  filteredContacts: any[] = [];
  availableSkills: any[] = [];
  skillsList: any[] = [];
  showSkillInputs: boolean = false;
  skillButtonText: string = 'Add Skill';
  opportunityForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private opportunityService: OpportunityServiceService,
    private skillsService: SkillsServiceService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadSkills();
  }

  priorities = Object.values(OpportunityPriority);
  types = Object.values(OpportunityType);
  Locations = Object.values(OpportunityLocation);
  confidenceLevels = Object.values(OpportunityConfidence);

  initializeForm()
  {
    this.opportunityForm = this.fb.group({
    name: [{value:'',disabled:true},
       [Validators.required, 
        Validators.minLength(3),
        Validators.pattern('^[A-Za-z]+( [A-Za-z]+)*$')],
        [this.uniqueNameValidator.bind(this)]],
        priority: [{value:'',disabled:true},[Validators.required]],
        type: [{value:'',disabled:true}, [Validators.required]],
        location : [{value:'',disabled:true}, [Validators.required]],
        size : [{value:'',disabled:true}, [Validators.required,Validators.pattern('^[0-9]+$')]],
        value : [{value:'',disabled:true}, [Validators.required]],
        confidence : [{value:'',disabled:true}, [Validators.required]],
        proposalLink : [{value:'',disabled:true}],
        customerId : ['', [Validators.required]],
    contactId : ['', [Validators.required]],
    skillName: [{value:'',disabled:true}],
    numberOfPeople: [{value:'',disabled:true}],
    yearsOfExperience: [{value:'',disabled:true}],
    rate: [{value:'',disabled:true}]
  });
  
}

  uniqueNameValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value || control.value.trim() === '') {
      return of(null); // No validation if the field is empty (handled by required validator)
    }
    return of(control.value).pipe(
      debounceTime(1000),
      distinctUntilChanged(), // Avoid multiple requests
      switchMap(value =>
        this.opportunityService.IsOpportunityNameUniqueForCustomer(value.trim(),this.opportunityForm.value.customerId,this.opportunityForm.value.opportunityId)
        .pipe(
          map((res:boolean) => (res ? null : {nameTaken:true})),
          catchError(()=> of(null))
        )
      )
    );
  }

  disableSkillButton: boolean = true;

  // Skill management
  skills: any[] = [];
  currentSkill: any = {
    skillName: '',
    numberOfPeople: null,
    yearsOfExperience: null, 
    rate: null
  };

  toggleSkillInputs() {
    this.showSkillInputs = !this.showSkillInputs;
    this.skillButtonText = this.showSkillInputs ? 'Save Skill' : 'Add Skill';
  }

  addSkill() {
    if (this.opportunityForm.get('skillName')?.valid &&   
        this.opportunityForm.get('skillName')?.value !== '' && 
        this.opportunityForm.get('numberOfPeople')?.valid &&   
        this.opportunityForm.get('numberOfPeople')?.value !== '' && 
        this.opportunityForm.get('yearsOfExperience')?.valid &&  
        this.opportunityForm.get('yearsOfExperience')?.value !== '' && 
        this.opportunityForm.get('rate')?.valid &&  
        this.opportunityForm.get('rate')?.value !== '') {
      
      const skillData = {
        skillName: this.opportunityForm.get('skillName')?.value,
        numberOfPeople: this.opportunityForm.get('numberOfPeople')?.value,
        yearsOfExperience: this.opportunityForm.get('yearsOfExperience')?.value,
        rate: this.opportunityForm.get('rate')?.value
      };
      
      this.skillsList.push(skillData);
      this.opportunityForm.get('skillName')?.reset();
      this.opportunityForm.get('numberOfPeople')?.reset();
      this.opportunityForm.get('yearsOfExperience')?.reset();
      this.opportunityForm.get('rate')?.reset();
      this.toggleSkillInputs(); // This will also update the button text
    }
  }

  removeSkill(index: number) {
    this.skillsList.splice(index, 1);
  }

  cancelSkillAdd() {
    this.toggleSkillInputs();
  }

  closeModal() {
    this.initializeForm(); // Reset form when closing modal
    this.filteredContacts = [];
  }

  addOpportunity() {
    if (this.opportunityForm.valid) {
      const opportunityData = {
        ...this.opportunityForm.value,
        opportunitySkills: this.skillsList
      };
      
      console.log('New Opportunity:', opportunityData);
      this.opportunityService.addOpportunity(opportunityData).subscribe({
        next: (res:any)=>{
          console.log(res);
          if(res.succeeded)
          {
            this.opportunityForm.reset();
            this.skillsList = []; // Clear skills list after successful submission
            this.closeModal();
            this.ReloadOpportunities.emit(true);
          }
        },
        error: (err=>console.log(err))
      });
    }
  }

  onCustomerSelect(event: Event) {
    const selectedCustomerId = (event.target as HTMLSelectElement).value;
    
    if (selectedCustomerId) {
      this.filteredContacts = this.contacts.filter(contact => contact.customerId === selectedCustomerId);
      this.opportunityForm.controls['contactId'].enable(); // Enable contact dropdown
    } else {
      this.filteredContacts = [];
      this.opportunityForm.controls['contactId'].reset();
      this.opportunityForm.controls['contactId'].disable();
    }
    this.toggleOpportunityFields(); // Enable or disable fields
  }

  toggleOpportunityFields() {
    const isCustomerSelected = !!this.opportunityForm.value.customerId;
    const isContactSelected = !!this.opportunityForm.value.contactId;
  
    if (isCustomerSelected && isContactSelected) {
      Object.keys(this.opportunityForm.controls).forEach((field) => {
        if (field !== 'customerId' && field !== 'contactId') {
          this.opportunityForm.controls[field].enable();
        }
      });
    } else {
      Object.keys(this.opportunityForm.controls).forEach((field) => {
        if (field !== 'customerId' && field !== 'contactId') {
          this.opportunityForm.controls[field].disable();
        }
      });
    }
  }
  
  onContactSelect() {
    this.toggleOpportunityFields();
  }
  // Helper method to check validation errors
  get formControls() {
    return this.opportunityForm.controls;
  }
  
  loadSkills() {
    this.skillsService.GetAllSkillsNonPaginated().subscribe((data) => {
      this.availableSkills = data;
    });
  }
}
