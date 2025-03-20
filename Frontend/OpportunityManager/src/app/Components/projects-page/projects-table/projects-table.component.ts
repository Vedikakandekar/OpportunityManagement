import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, switchMap } from 'rxjs';
import { BillingType, Currency, projectStatus } from 'src/app/Models/Projects';
import { ErrorPopupService } from 'src/app/Services/error-popup.service';
import { ProjectServiceService } from 'src/app/Services/project-service.service';
import { ResourceServiceService } from 'src/app/Services/resource-service.service';
import { SkillsServiceService } from 'src/app/Services/skills-service.service';
declare var bootstrap:any;
@Component({
  selector: 'app-projects-table',
  templateUrl: './projects-table.component.html',
  styleUrls: ['./projects-table.component.css']
})
export class ProjectsTableComponent implements OnInit, AfterViewInit {
  projects: any = [];
  filteredProjects: any[] = [];
  editForms: { [key: string]: FormGroup } = {}; // Form for each row
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;
  clearFilter: boolean = false;
  skills:any[]=[];
  resources:any[];
  openAddResourceModal: boolean = false;
  selectedProjectId: string = '';


  currentDataSource: 'all' | 'searchFilter'  = 'all';
  currentFilters: any = null;

  currencies = Object.values(Currency);
  statuses = Object.values(projectStatus);
  billingTypes = Object.values(BillingType);

  constructor(
    private projectService: ProjectServiceService,
    private resourceService:ResourceServiceService,
    private skillService:SkillsServiceService,
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
    this.fetchProjects('all', undefined);

  }


  toggleClearFilter() {
    this.clearFilter = !this.clearFilter;
  }

  toggleAddResourceModal(projectId:string) {
    this.selectedProjectId = projectId;
    this.openAddResourceModal = true;
  }

  initEditForms() {

    this.filteredProjects.forEach((project) => {
      
      const formGroup = this.fb.group({
        status: [project.status,Validators.required],
        billingType: [project.billingType,Validators.required],
        projectName: [project.projectName,[Validators.required, 
          Validators.minLength(3),
          Validators.pattern('^[A-Za-z]+( [A-Za-z]+)*$')], [this.uniqueNameValidatorFactory(project.customerId,project.projectId)]],
        currency: [project.currency,Validators.required],
        customerId: [project.customerId,Validators.required],
        contactId: [project.contactId,Validators.required],
        customerName: [project.customerName,Validators.required],
        contactName: [project.contactName,Validators.required],
        projectId: [project.projectId,Validators.required],
      });

      formGroup
      .get('projectName')
      ?.statusChanges.pipe() // Prevent multiple calls
      .subscribe((status) => {
        const control = formGroup.get('projectName');
        if (status === 'INVALID' && (formGroup.get('projectName')?.touched || formGroup.get('projectName').dirty)) {
          if (control.errors) {
            if (control.errors['required']) {
              this.showErrorPopup("Project name is required!");
            } else if (control.errors['minlength']) {
              this.showErrorPopup("Project name must contain at least 3 letters!");
            } else if (control.errors['pattern']) {
              this.showErrorPopup("Project name should contain only letters and single spaces!");
            } else if (control.errors['nameTaken']) {
              this.showErrorPopup("Project name is already taken for this customer!");
            }
          }
        }
      });

      this.editForms[project.projectId] = formGroup;
    });
    Object.values(this.editForms).forEach(form => form.updateValueAndValidity());
  }

  
  uniqueNameValidatorFactory(customerId: string, projectId: string) {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || control.value.trim() === '') {
        return of(null); // No validation if the field is empty (handled by required validator)
      }
      return this.projectService
      .IsProjectNameUniqueForCustomer(control.value.trim(), customerId, projectId)
      .pipe(
        debounceTime(500), // Add debounce to prevent excessive API calls
        distinctUntilChanged(),
        map((isUnique: boolean) => (isUnique ? null : { nameTaken: true })),
        catchError(() => of(null)) // Handle API errors gracefully
      );
    };
  }


  


  saveProject(projectId: string) {

    const form = this.editForms[projectId];

    
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
    if(this.editForms[projectId].valid)
    {
      const updatedValues = this.editForms[projectId].value;
      console.log("updated values after save : ",updatedValues);
      this.projectService.editProject(updatedValues).subscribe({
        next: (res) => {
          console.log('Updated Successfully', res);
          if(!this.currentFilters)
          {
            this.fetchProjects('all', undefined); // Refresh table after update
          }
       else
       {
        this.fetchProjects(undefined, this.currentFilters); // Refresh table after update
       }
        },
        error: (err) => {
          console.error('Error updating Project', err);
        },
      });
    }
    else{
      let invalidFields: string[] = [];
      Object.keys(this.editForms[projectId].controls).forEach((field) => {
        const control = this.editForms[projectId].get(field);
        if (control?.invalid) {
          invalidFields.push(field); // Store the invalid field name
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

  fetchProjects(all?: any, filters?: any) {
    if (!all  && !filters) {
      all = 'all';
    }
    if (all === 'all') {
      this.projectService
        .getAllProjects(this.currentPage, this.pageSize)
        .subscribe({
          next: (result: any) => {
            console.log('Projects in onInit ');
            console.log(result.res);
            this.currentDataSource = 'all';
            this.projects = result.res;
            this.totalRecords = result.totalRecords;
            this.filteredProjects = result.res;
            this.initEditForms();
          },
        });
    } else if ( filters) {
      if (
        filters['searchTerm']?.trim().length != 0 ||
        filters['sortBy'] ||
        filters['Billingtype'] ||
        filters['status'] 
      ) {
        this.projectService
          .filterProjects(
            this.currentPage,
            this.pageSize,
            filters
          )
          .subscribe({
            next: (result: any) => {
              console.log('Filtered Projects: ', result);
              this.currentDataSource = 'searchFilter';
            
              this.currentFilters = filters;
              this.filteredProjects = result.res;
              this.totalRecords = result.totalRecords; // Update filtered data

              this.editForms = {};
              this.initEditForms(); // Reinitialize forms with new data
            },
            error: (err) => console.log('Search Error: ', err),
          });
      } else {
        // If search term is empty, reset to full project list
        this.errorPopupService.showErrorPopup("All filters are empty : ","warning");
        this.filteredProjects = [...this.projects];
        this.initEditForms();
      }
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchProjectsBasedOnSource();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page
    this.fetchProjectsBasedOnSource();
  }

  fetchProjectsBasedOnSource() {
    if (this.currentDataSource === 'all') {
      this.fetchProjects('all', undefined);
    } else if (this.currentDataSource === 'searchFilter') {
      this.fetchProjects(
        undefined,
        this.currentFilters
      );
    }
  }
}
