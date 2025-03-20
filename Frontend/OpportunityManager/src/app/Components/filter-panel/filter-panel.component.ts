import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OpportunityLocation, OpportunityPriority, OpportunityStage, OpportunityStatus, OpportunityType } from 'src/app/Models/Opportunity';
import { ErrorPopupService } from 'src/app/Services/error-popup.service';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.css']
})
export class FilterPanelComponent {
  @Output() filterApplied = new EventEmitter<any>();
  @Output() filterSearchApplied = new EventEmitter<any>();
  @Output() ReloadOpportunities = new EventEmitter<any>();

  filterForm: FormGroup;
  showFilterPanel: boolean = false;

 Stages = Object.values(OpportunityStage);
 Types = Object.values(OpportunityType);
 Statuses = Object.values(OpportunityStatus);
 Locations = Object.values(OpportunityLocation);
 Priorities = Object.values(OpportunityPriority);
 hasFilters : boolean = false;



  constructor(private fb: FormBuilder , private errorPopupService: ErrorPopupService)
      {
    this.filterForm = this.fb.group({
      searchTerm:[''],
      sortBy: [''],
      show: [''],
      stage: [''],
      type: [''],
      status: [''],
      location: [''],
      priority: ['']
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
