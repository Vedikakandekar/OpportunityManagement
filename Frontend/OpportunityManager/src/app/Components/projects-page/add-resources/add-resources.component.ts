import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ResourceServiceService } from 'src/app/Services/resource-service.service';

@Component({
  selector: 'app-add-resources',
  templateUrl: './add-resources.component.html',
  styleUrls: ['./add-resources.component.css']
})
export class AddResourcesComponent implements OnInit {

  @Input() projectId: string = "";
  resources: any[] = [];
  selectedResources: any[] = [];
  originalSelectedResources: any[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;
  searchTerm: string = "";
  hasChanges: boolean = false;

  constructor(private resourceService: ResourceServiceService) {}

  ngOnInit() {
    this.loadResources();
  }

  loadResources() {
    this.resourceService.getAllResources(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        this.resources = res.res;
        this.totalRecords = res.totalRecords;
        this.markPreselectedResources();
      },
      error: (err) => console.log(err)
    });
  }

  markPreselectedResources() {
    this.selectedResources = this.resources.filter(resource => resource.projectId === this.projectId);
    this.originalSelectedResources = [...this.selectedResources]; // Clone the array to track changes
    this.sortResources();
  }

  isResourceSelected(resource: any): boolean {
    return this.selectedResources.some(res => res.resourceId === resource.resourceId);
  }

  toggleSelection(resource: any) {
    const index = this.selectedResources.findIndex(res => res.resourceId === resource.resourceId);
    if (index > -1) {
      this.selectedResources.splice(index, 1);
    } else {
      this.selectedResources.push(resource);
    }
    this.checkForChanges();
  }

  checkForChanges() {
    this.hasChanges = JSON.stringify(this.selectedResources) !== JSON.stringify(this.originalSelectedResources);
  }

  searchResources() {
    this.currentPage = 1;
    this.loadResources();
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadResources();
  }

  updatePageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadResources();
  }

  sortResources() {
    this.resources.sort((a, b) => {
      return Number(this.isResourceSelected(b)) - Number(this.isResourceSelected(a));
    });
  }

  saveSelectedResources() {
    const selectedResourceIds = this.selectedResources.map(resource => resource.resourceId);
  
    console.log("Saving selected resources for project:", this.projectId, selectedResourceIds);
  
    // Call service method and pass projectId + selectedResourceIds as FormData
    this.resourceService.addProjectToResource(this.projectId, selectedResourceIds)
      .subscribe({
        next: (response) => {
          console.log("Resources saved successfully:", response);
          this.originalSelectedResources = [...this.selectedResources]; // Update original selection
          this.hasChanges = false;
        },
        error: (err) => {
          console.error("Error saving resources:", err);
        }
      });
  }

  clearChanges() {
    this.selectedResources = [...this.originalSelectedResources]; // Reset to original state
    this.hasChanges = false;
  }

  saveChanges() {
    if (this.hasChanges) {
      this.saveSelectedResources();
    }
  }
}