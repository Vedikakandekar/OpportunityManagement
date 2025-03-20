import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from 'src/app/Models/Customer';
import { ContactServiceService } from 'src/app/Services/contact-service.service';
import { CustomerServiceService } from 'src/app/Services/customer-service.service';

@Component({
  selector: 'app-add-new-contact-button',
  templateUrl: './add-new-contact-button.component.html',
  styleUrls: ['./add-new-contact-button.component.css']
})
export class AddNewContactButtonComponent {
  isModalOpen = false;
  isDisabled = true;  // One flag to disable all fields
  customerForm: FormGroup;
  @Input()
  customers : Customer[]=[];
  @Output()
  reloadContacts:any =new  EventEmitter<boolean>();

  profileImage: string = 'assets/Images//User/user4.jpg'; // Default image
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder,private contactService :ContactServiceService) {
    this.customerForm = this.fb.group({
      customerId: ['', Validators.required],
      customerName: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      designation: ['', Validators.required],
      email: ['', [Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      mobile: ['', [Validators.required]],
      profileImage: [null]
    });
  }

  updatePhoneNumber(phone: string) {
    this.customerForm.get('mobile')?.setValue(phone);
    console.log(this.customerForm['mobile']);
  }
  get formControls() {
    return this.customerForm.controls;
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.customerForm.reset();
    this.isDisabled = true;
  }

   // Handle image selection
   onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.customerForm.patchValue({ profileImage: file });

      // Show image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onCustomerSelect(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.isDisabled = !selectedValue; // Enable fields only if a customer is selected
    const selectedCustomer = this.customers.find(c => c.id === selectedValue);
    if (selectedCustomer) {
      this.customerForm.patchValue({
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name
      });
    }
  }

  addContact() {
    if (this.customerForm.valid) {
      const formData: FormData = new FormData();
      formData.append('customerId', this.customerForm.value.customerId || '');
      formData.append('customerName', this.customerForm.value.customerName || '');
      formData.append('name', this.customerForm.value.name || '');
      formData.append('designation', this.customerForm.value.designation || '');
      formData.append('email', this.customerForm.value.email || '');
      formData.append('mobile', this.customerForm.value.mobile || '');
      if (this.selectedFile) {
        formData.append('profileImage', this.selectedFile, this.selectedFile.name);
      }
      console.log('Submitted Data:', this.customerForm.value);
      this.contactService.addContact(formData).subscribe({
        next:(res:any)=>{
          this.closeModal();
          this.reloadContacts.emit(true);
        },
        error:(res : any)=>console.log(res)
      });
    }
  }
}
