import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Shared/Services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  profileImage: string = 'assets/Images//User/user4.jpg'; // Default image
  selectedFile: File | null = null; //
  constructor(public formBuilder: FormBuilder, private service: AuthService, private router:Router){}

  ngOnInit(): void {
    if(this.service.isLoggedIn())
    {
      this.router.navigateByUrl("/Dashboard");
    }
  }

  isSubmitted:boolean=false;

  PasswordMatchValidator : ValidatorFn = (control:AbstractControl):null =>{
      const password = control.get('password')
      const confirmPassword = control.get('confirmPassword')
      if(password && confirmPassword && password.value != confirmPassword.value)
      {
        confirmPassword?.setErrors({PasswordMisMatch:true})
      }
      else
      {
        confirmPassword?.setErrors(null)
      }
    return null;
  }

  form = this.formBuilder.group({
      fullName : ['',Validators.required],
      email : ['',[Validators.required,Validators.email,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      password : ['',[Validators.required,Validators.minLength(6)]],
      confirmPassword : ['',Validators.required],
      profileImage: [null]
    },{validators:this.PasswordMatchValidator});

     // Handle image selection
  onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.form.patchValue({ profileImage: file });

      // Show image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }


    onSubmit()
    {
      this.isSubmitted=true;
      if(this.form.valid)
      {
        const formData = new FormData();
        formData.append('fullName', this.form.value.fullName || '');
        formData.append('email', this.form.value.email || '');
        formData.append('password', this.form.value.password || '');
       
    
        if (this.selectedFile) {
          formData.append('profileImage', this.selectedFile, this.selectedFile.name);
        }
        this.service.createUser(formData).subscribe({
          next: (res:any)=>{
            if(res.succeeded)
            {
              this.form.reset();
              this.isSubmitted= false;
              this.router.navigateByUrl("/Login");
            }
            console.log(res)},
          error: err=>{ console.log(err)}
        });
      }
    }

    isErrorDisplayable(controlName:string)
    {
      const control = this.form.get(controlName);
      return Boolean(control?.invalid && (this.isSubmitted || Boolean(control?.touched || Boolean(control?.dirty))))
    }

  }