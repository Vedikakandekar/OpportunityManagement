import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OpportunityLocation, OpportunityPriority, OpportunityStage, OpportunityStatus, OpportunityType } from 'src/app/Models/Opportunity';
import { ErrorPopupService } from 'src/app/Services/error-popup.service';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.css']
})
export class FilterPanelComponent implements OnInit {
  @Output() filterApplied = new EventEmitter<any>();
  @Output() filterSearchApplied = new EventEmitter<any>();
  @Output() ReloadOpportunities = new EventEmitter<any>();

  filterForm: FormGroup;
  showFilterPanel: boolean = false;

  // Properties for ngModel binding
  searchTerm: string = '';
  sortBy: string = '';

  Stages = Object.values(OpportunityStage);
  Types = Object.values(OpportunityType);
  Statuses = Object.values(OpportunityStatus);
  Locations = Object.values(OpportunityLocation);
  Priorities = Object.values(OpportunityPriority);
  hasFilters: boolean = false;

  constructor(private fb: FormBuilder, private errorPopupService: ErrorPopupService) {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      sortBy: [''],
      show: [''],
      stage: [''],
      type: [''],
      status: [''],
      location: [''],
      priority: ['']
    });
  }

  ngOnInit() {
    // Subscribe to form value changes
    this.filterForm.valueChanges.subscribe(() => {
      this.hasFilters = this.isFilterApplied();
    });
  }

  // Methods for ngModelChange events
  onSearchTermChange(value: string) {
    this.hasFilters = this.isFilterApplied();
    console.log('Search term changed:', value);
  }

  onSortByChange(value: string) {
    this.hasFilters = this.isFilterApplied();
    console.log('Sort by changed:', value);
  }

  clearFilters() {
    this.filterForm.reset();
    this.searchTerm = '';
    this.sortBy = '';
    this.ReloadOpportunities.emit(true);
  }
  
  toggleFilterPanel() {
    this.showFilterPanel = !this.showFilterPanel;
  }

  isFilterApplied() {
    const formValues = this.filterForm.value;
    return Object.values(formValues).some(value => value !== null && value !== undefined && value !== ''); 
  }

  applyFilters() {
    const formValues = this.filterForm.value;
    if (this.hasFilters) {
      this.filterSearchApplied.emit(formValues);
      this.toggleFilterPanel();
    } else {
      this.errorPopupService.showErrorPopup("All filters are empty!", "warning");
    }
  }
}
