import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BillingType, Currency, projectStatus } from 'src/app/Models/Projects';
import { ErrorPopupService } from 'src/app/Services/error-popup.service';

@Component({
  selector: 'app-projections-filter',
  templateUrl: './projections-filter.component.html',
  styleUrls: ['./projections-filter.component.css']
})
export class ProjectionsFilterComponent {
 @Output() filterApplied = new EventEmitter<any>();
  @Output() filterSearchApplied = new EventEmitter<any>();
  @Output() ReloadOpportunities = new EventEmitter<any>();

  filterForm: FormGroup;
  showFilterPanel: boolean = false;

 statuses = Object.values(projectStatus);
 billingTypes = Object.values(BillingType);
 currencies = Object.values(Currency);
 hasFilters : boolean = false;



  constructor(private fb: FormBuilder , private errorPopupService: ErrorPopupService)
      {
    this.filterForm = this.fb.group({
      searchTerm:[''],
      sortBy: [''],
      billingType: [''],
      status: [''],
      currency: [''],
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.ReloadOpportunities.emit(true);
  }
  
  toggleFilterPanel() {
    this.showFilterPanel = !this.showFilterPanel;
  }

  applyFilters() {
    const formValues = this.filterForm.value;
    // Check if at least one field is non-empty
    this.hasFilters = Object.values(formValues).some(value => value !== null && value !== undefined && value !== ''); 
    if (!this.hasFilters) {
      this.toggleFilterPanel(); // Close filter panel
      this.errorPopupService.showErrorPopup("All filters are empty ! ","warning");
      return;
    }
    // Emit event only if some filters are applied
    this.filterSearchApplied.emit(formValues);
    this.toggleFilterPanel();
  }

}
