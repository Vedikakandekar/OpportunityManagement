import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './Shared/auth.guard';
import { OpportunityComponent } from './Components/opportunity/opportunity.component';
import { CustomerPageComponent } from './Components/customer-page/customer-page.component';
import { ContactsPageComponent } from './Components/contacts-page/contacts-page.component';
import { ForbiddenPageComponent } from './Components/forbidden-page/forbidden-page.component';
import { ResourceNotAvailableComponent } from './Components/resource-not-available/resource-not-available.component';
import { ProjectsPageComponent } from './Components/projects-page/projects-page.component';
import { ReportsPageComponent } from './Components/reports-page/reports-page.component';

const routes: Routes = [
  {path: '',component: LoginComponent},
    
  { path: 'Login', component: LoginComponent },
  { path: 'Register', component: RegistrationComponent },
{ path: 'Dashboard', component: DashboardComponent, canActivate:[authGuard],
  children: [
    { path: '', redirectTo: 'opportunity', pathMatch: 'full' }, // Default route
    { path: 'opportunity', component: OpportunityComponent },
    {path: 'Customers',component: CustomerPageComponent},
    {path: 'Contacts',component: ContactsPageComponent},
    {path: 'Projects',component: ProjectsPageComponent},
    {path: 'Reports',component: ReportsPageComponent},
  ], },

  { path: 'forbidden', component: ForbiddenPageComponent },
  { path: 'not-found', component: ResourceNotAvailableComponent },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
