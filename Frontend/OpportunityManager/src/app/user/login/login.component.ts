import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TOKEN_KEY } from 'src/app/Shared/constants';
import { AuthService } from 'src/app/Shared/Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(public formBuilder: FormBuilder, private service: AuthService, private router:Router){}
  
  ngOnInit(): void {
    if(this.service.isLoggedIn())
    {
      this.router.navigateByUrl("/Dashboard");
    }
  }
  isSubmitted:boolean=false;


  form = this.formBuilder.group({
     email : ['',[Validators.required,Validators.email,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      password : ['',[Validators.required]],
    });

    onSubmit()
    {
      this.isSubmitted=true;
      if(this.form.valid)
      {
        this.service.signIn(this.form.value).subscribe({
          next:(res:any)=>{
            localStorage.setItem(TOKEN_KEY,res.token);
            this.router.navigateByUrl("/Dashboard");
          },
          error:err=>{console.log(err)}
        });
          
        };
      
    }

    isErrorDisplayable(controlName:string)
    {
      const control = this.form.get(controlName);
      return Boolean(control?.invalid && (this.isSubmitted || Boolean(control?.touched || Boolean(control?.dirty))))
    }
}
