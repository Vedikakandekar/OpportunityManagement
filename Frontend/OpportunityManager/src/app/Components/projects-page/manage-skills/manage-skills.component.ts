import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkillsServiceService } from 'src/app/Services/skills-service.service';

@Component({
  selector: 'app-manage-skills',
  templateUrl: './manage-skills.component.html',
  styleUrls: ['./manage-skills.component.css']
})
export class ManageSkillsComponent implements OnInit {
  @ViewChild('skillNameInput') skillNameInput!: ElementRef;
  
  showSkillCard: boolean = false;
  showSkillForm: boolean = false;
  totalCount: number = 0;

  paginatedSkills: any[] = [];
  skillForm!: FormGroup;
  editingSkillId: string | null = null;
  isEditing: boolean = false;

  currentPage: number = 1;
  pageSize: number = 5;

  constructor(private skillService: SkillsServiceService, private fb: FormBuilder) {}

  ngOnInit() {
    this.updatePaginatedSkills();
    this.initializeForm();
  }

  initializeForm() {
    this.skillForm = this.fb.group({
      SkillName: ['', Validators.required]  // Ensuring input is not empty
    });
  }

  openSkillCard() {
    this.showSkillCard = true;
    this.updatePaginatedSkills();
  }

  closeSkillCard() {
    this.showSkillCard = false;
  }

  openSkillForm(skill: any = null) {
    if (skill) {
      // Editing an existing skill
      this.isEditing = true;
      this.editingSkillId = skill.id;
      console.log("skill form values: ",skill);
      this.skillForm.patchValue({ SkillName: skill.skillName });
    } else {
      // Adding a new skill
      this.isEditing = false;
      this.editingSkillId = null;
      this.skillForm.reset();
    }
    this.showSkillForm = true;
    
    // Set focus after form is shown
    setTimeout(() => {
      this.skillNameInput?.nativeElement?.focus();
    });
  }

  closeSkillForm() {
    this.showSkillForm = false;
    this.skillForm.reset();
    this.isEditing = false;
    this.editingSkillId = null;
  }

  editSkill(skill: any) {
    this.openSkillForm(skill);
  }

  deleteSkill(skillId: string) {
    this.skillService.deleteSkill(skillId).subscribe(() => {
      this.updatePaginatedSkills(); 
    });
  }
  saveSkill() {
    if (this.skillForm.valid) {
      const skillData = this.skillForm.value;
  console.log("skill data : ",skillData)
      if (this.isEditing && this.editingSkillId) {
        // Edit existing skill (JSON format)
        this.skillService.editSkill({ Id: this.editingSkillId, ...skillData }).subscribe(() => {
          this.closeSkillForm();
          this.updatePaginatedSkills();
        });
      } else {
        // Add new skill (FormData format)
        const formData = new FormData();
        formData.append('SkillName', skillData.SkillName);
  
        this.skillService.SaveSkill(formData).subscribe(() => {
          this.closeSkillForm();
          this.updatePaginatedSkills();
        });
      }
    }
  }
  

  changePage(page: number) {
    this.currentPage = page;
    this.updatePaginatedSkills();
  }

  changePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.updatePaginatedSkills();
  }

  updatePaginatedSkills() {
    this.skillService.GetAllSkills(this.currentPage, this.pageSize).subscribe((response: any) => {
      this.paginatedSkills = response.res;
      this.totalCount = response.totalRecords;
      console.log("Paginated Skills: ",response);
    });
  }
}
