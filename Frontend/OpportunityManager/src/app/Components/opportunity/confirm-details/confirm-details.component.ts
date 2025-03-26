import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { opportunitySkills} from 'src/app/Models/Resources';
import { Opportunity } from 'src/app/Models/Opportunity';
import { Customer } from 'src/app/Models/Customer';
import { SkillsServiceService } from 'src/app/Services/skills-service.service';

@Component({
  selector: 'app-confirm-details',
  templateUrl: './confirm-details.component.html',
  styleUrls: ['./confirm-details.component.css']
})
export class ConfirmDetailsComponent implements OnInit {
  @Input() opportunity: Opportunity;
  @Input() customer: Customer;
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitDetails = new EventEmitter<any>();
  @Input() showConfirmDetails: boolean = false;
  @Input() resourceSkillsAssociatedWithOpportunity:any[]=[];

  confirmForm: FormGroup;
  opportunitySkills: opportunitySkills[] = [];
  skills:any[]=[];

  constructor(private fb: FormBuilder,private skillsService:SkillsServiceService) {
    this.confirmForm = this.fb.group({
      customerName: ['', Validators.required],
      opportunityName: ['', Validators.required],
      valuation: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      details: ['', Validators.required],
      opportunitySkills: this.fb.array([]),
      comments: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSkills();
    if (this.opportunity && this.customer) {
      this.confirmForm.patchValue({
        customerName: this.customer.name,
        opportunityName: this.opportunity.name,
        valuation: this.opportunity.value,
        details: `${this.opportunity.type} - ${this.opportunity.location}`
      });
      this.resourceSkillsAssociatedWithOpportunity.forEach(resource => {
        const resourceForm = this.fb.group({
          numberOfPeople: [resource.numberOfPeople, [Validators.required, Validators.min(1)]],
          skillName: [resource.skillName, Validators.required],
          yearsOfExperience: [resource.yearsOfExperience, [Validators.required, Validators.min(0)]],
          rate: [resource.rate, [Validators.required, Validators.min(0)]]
        });
        this.resourcesArray.push(resourceForm);
      });
    }
  }

  get resourcesArray() {
    return this.confirmForm.get('opportunitySkills') as FormArray;
  }

  loadSkills() {
    this.skillsService.GetAllSkillsNonPaginated().subscribe((data) => {
      this.skills = data;
    });
  }
  addResource() {
    const resourceForm = this.fb.group({
      numberOfPeople: ['', [Validators.required, Validators.min(1)]],
      skillName: ['', Validators.required],
      yearsOfExperience: ['', [Validators.required, Validators.min(0)]],
      rate: ['', [Validators.required, Validators.min(0)]]
    });
    this.resourcesArray.push(resourceForm);
  }

  removeResource(index: number) {
    this.resourcesArray.removeAt(index);
  }

  onSubmit() {
    if (this.confirmForm.valid) {
      this.submitDetails.emit(this.confirmForm.value);
    }
  }

  close() {
    this.closeModal.emit();
  }
}
