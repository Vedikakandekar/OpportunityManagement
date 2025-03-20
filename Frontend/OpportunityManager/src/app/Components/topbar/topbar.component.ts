import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TOKEN_KEY } from 'src/app/Shared/constants';
import { AuthService } from 'src/app/Shared/Services/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements AfterViewInit{
  constructor(private router: Router, private userService: AuthService){}

  profileImg : any = 'assets/Images/User/user4.jpg'; ;
  
  ngAfterViewInit(): void {
   this.userService.getUserProfileImage().subscribe({
    next: (res:any) =>
    {
      console.log(res)
      if(res.res)
      {
        this.profileImg=res.res;
        console.log(res.res)
      }
    },
    error:res => console.error(res)
   });
  }

  onLogout()
  {
    localStorage.removeItem(TOKEN_KEY);
    this.router.navigateByUrl('/Login');
  }


}
