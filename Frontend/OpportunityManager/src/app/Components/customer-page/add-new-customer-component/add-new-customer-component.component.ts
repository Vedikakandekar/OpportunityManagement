import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerServiceService } from 'src/app/Services/customer-service.service';

@Component({
  selector: 'app-add-new-customer-component',
  templateUrl: './add-new-customer-component.component.html',
  styleUrls: ['./add-new-customer-component.component.css']
})
export class AddNewCustomerComponentComponent {
  isModalOpen = false;
  @Output()
  reloadCustomers:any =new  EventEmitter<boolean>();

  profileImage: string = 'assets/Images//User/user4.jpg'; // Default image
  selectedFile: File | null = null;
  constructor(private fb: FormBuilder, private customerService: CustomerServiceService) {
    // Initialize the form with FormBuilder
   
  }


  

  customerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['',[Validators.required,Validators.email,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
    phoneNumber: ['', [Validators.required]],
    profileImage: [null]
  });


  updatePhoneNumber(phone: string) {
    this.customerForm.get('phoneNumber')?.setValue(phone);
    console.log(this.customerForm['phoneNumber']);
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
    

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.customerForm.reset(); // Reset form when closing modal
  }

  addOpportunity() {
    if (this.customerForm.valid) {
      const formData: FormData = new FormData();
      formData.append('name', this.customerForm.value.name || '');
      formData.append('email', this.customerForm.value.email || '');
      formData.append('phoneNumber', this.customerForm.value.phoneNumber || '');
     
  
      if (this.selectedFile) {
        formData.append('profileImage', this.selectedFile, this.selectedFile.name);
      }

      this.customerService.SaveCustomer(formData).subscribe({
        next: (res:any)=>{
          console.log(res);
          if(res.succeeded)
          {
            this.customerForm.reset();
            this.closeModal();
            this.reloadCustomers.emit(true);
          }
        },
        error: (err=>console.log(err))
      })
      
    }
  }

  // Helper method to check validation errors
  get formControls() {
    return this.customerForm.controls;
  }
}
