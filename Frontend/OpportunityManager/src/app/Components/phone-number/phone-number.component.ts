import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.css']
})
export class PhoneNumberComponent {
  phoneForm: FormGroup;
  phoneMask = ''; // Mask pattern
  countryCode = ''; // Country code prefix
  @Output() phoneValid = new EventEmitter<string>(); 
  
  constructor(private fb: FormBuilder) {
    this.phoneForm = this.fb.group({
      country: ['', Validators.required],
      phoneNumber: ['', Validators.required] // Validation is updated dynamically
    });
    this.phoneForm.valueChanges.subscribe(() => {
      this.emitValidPhoneNumber();
    });
  }

  updateMask() {
    const country = this.phoneForm.get('country')?.value;
    const phoneControl = this.phoneForm.get('phoneNumber');

    switch (country) {
      case 'IN': // India: 10 digits
        this.countryCode = '+91 ';
        this.phoneMask = '00000-00000';
        phoneControl.setValidators([Validators.required, Validators.pattern(/^\d{10}$/)]);
        break;
      case 'US': // USA: 10 digits
        this.countryCode = '+1 ';
        this.phoneMask = '(000) 000-0000';
        phoneControl.setValidators([Validators.required, Validators.pattern(/^\d{10}$/)]);
        break;
      case 'UK': // UK: 10 or 11 digits
        this.countryCode = '+44 ';
        this.phoneMask = '0000 000000';
        phoneControl.setValidators([Validators.required, Validators.pattern(/^\d{10,11}$/)]);
        break;
      case 'UAE': // UAE: 9 digits
        this.countryCode = '+971 ';
        this.phoneMask = '00 000 0000';
        phoneControl.setValidators([Validators.required, Validators.pattern(/^\d{9}$/)]);
        break;
      default:
        this.countryCode = '';
        this.phoneMask = '';
        phoneControl.clearValidators();
    }

    phoneControl.updateValueAndValidity();
  }

  emitValidPhoneNumber() {
    if (this.phoneForm.valid) {
      const fullPhoneNumber = `${this.countryCode} ${this.phoneForm.value.phoneNumber}`;
      this.phoneValid.emit(fullPhoneNumber);
    }
  }
}
