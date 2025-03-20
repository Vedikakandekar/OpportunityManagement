import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResourceServiceService } from 'src/app/Services/resource-service.service';
import { SkillsServiceService } from 'src/app/Services/skills-service.service';

@Component({
  selector: 'app-manage-resources',
  templateUrl: './manage-resources.component.html',
  styleUrls: ['./manage-resources.component.css']
})
export class ManageResourcesComponent {
  showResourceCard: boolean = false;
  showAddResource: boolean = false;
  totalCount: number = 0;
  
  paginatedResources: any[] = [];
  resourceForm!: FormGroup;
  editingResourceId: string | null = null;
  isEditing: boolean = false;
  skills: any[] = [];

  currentPage: number = 1;
  pageSize: number = 5;

  constructor(private skillService: SkillsServiceService, private fb: FormBuilder, private resourceService: ResourceServiceService) {}

  ngOnInit() {
    this.updatePaginatedResources();
    this.initializeForm();
    this.loadSkills();
  }

  initializeForm() {
    this.resourceForm = this.fb.group({
      resourceName: ['', Validators.required],
      skillId: ['', Validators.required],
      rate: ['', [Validators.required, Validators.min(0)]]
    });
  }

  loadSkills() {
    this.skillService.GetAllSkillsNonPaginated().subscribe((data) => {
      this.skills = data;
      console.log("Skills in Resources: ",this.skills)
    });
  }



  openResourceCard() {
    this.showResourceCard = true;
    this.updatePaginatedResources();
  }

  closeResourceCard() {
    this.showResourceCard = false;
    this.isEditing = false;
    this.resourceForm.reset();
  }

  editResource(resource: any) {
    this.resourceForm.patchValue(resource);

    this.editingResourceId = resource.resourceId;
    this.isEditing = true;
    this.showAddResource = true;
  }

  deleteResource(resourceId: string) {
    this.resourceService.deleteResource(resourceId).subscribe(() => {
      this.updatePaginatedResources();
    });
  }

  saveResource() {

    if (this.resourceForm.invalid) return;

    const resourceData = this.resourceForm.value;

    if (this.isEditing && this.editingResourceId) {
      this.resourceService.editResource(resourceData).subscribe(() => {
        this.isEditing = false;
        this.editingResourceId = null;
        this.resourceForm.reset();
        this.updatePaginatedResources();
        this.showAddResource = false;
      });
    } else {
      const formData = new FormData();
      formData.append('resourceName',resourceData.resourceName),
      formData.append('skillId',resourceData.skillId),
      formData.append('rate',resourceData.rate)
      this.resourceService.addResource(formData).subscribe(() => {
        this.resourceForm.reset();
        this.updatePaginatedResources();
        this.showAddResource = false;
      });
    }
  }

  toggleAddResource() {
    this.showAddResource = !this.showAddResource;
    if (!this.showAddResource) {
      this.isEditing = false;
      this.editingResourceId = null;
      this.resourceForm.reset();
    }
  }

  changePage(page: number) {
    this.currentPage = page;
    this.updatePaginatedResources();
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.updatePaginatedResources();
  }

  updatePaginatedResources() {
    this.resourceService.getAllResources(this.currentPage,this.pageSize).subscribe((data:any) => {
      this.paginatedResources = data.res;
      this.totalCount = data.totalRecords;
      console.log("Paginated Resources: ",data);
    });
  }
}
