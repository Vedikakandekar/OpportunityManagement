import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-contact-modal',
  templateUrl: './edit-contact-modal.component.html',
  styleUrls: ['./edit-contact-modal.component.css']
})
export class EditContactModalComponent {
 @Input() userData: any;  // Receiving data from parent
  @Output() closeModal = new EventEmitter<void>(); // Emit close event
  @Output() saveChanges = new EventEmitter<any>(); // Emit updated data
  
  editForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.editForm = this.fb.group({
      name: [this.userData?.name || '', Validators.required],
      designation: [this.userData?.designation || '', Validators.required],
      email: [this.userData?.email || '', [Validators.required, Validators.email,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      mobile: [this.userData?.mobile || '', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
    });
    console.log(this.userData)
  }

  onSubmit() {
    if (this.editForm.valid) {
      this.saveChanges.emit(this.editForm.value);
    }
  }

  onClose() {
    this.closeModal.emit();
  }
}
