import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { SidebarHeaderComponent } from './Components/sidebar-header/sidebar-header.component';
import { SidebarItemComponent } from './Components/sidebar-item/sidebar-item.component';
import { SidebarItemsComponent } from './Components/sidebar-items/sidebar-items.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { TopbarComponent } from './Components/topbar/topbar.component';
import { TableComponent } from './Components/Generictable/table.component';
import { OpportunityComponent } from './Components/opportunity/opportunity.component';
import { CustomerPageComponent } from './Components/customer-page/customer-page.component';
import { AddNewCustomerComponentComponent } from './Components/customer-page/add-new-customer-component/add-new-customer-component.component';
import { EditCustomerModalComponent } from './Components/customer-page/edit-customer-modal/edit-customer-modal.component';
import { ContactsPageComponent } from './Components/contacts-page/contacts-page.component';
import { AddNewContactButtonComponent } from './Components/contacts-page/add-new-contact-button/add-new-contact-button.component';
import { EditContactModalComponent } from './Components/contacts-page/edit-contact-modal/edit-contact-modal.component';
import { AddNewOpportunityComponent } from './Components/opportunity/add-new-opportunity/add-new-opportunity.component';
import { OpportunityTableComponent } from './Components/opportunity/opportunity-table/opportunity-table.component';
import { SearchComponent } from './Components/search/search.component';
import { FilterPanelComponent } from './Components/filter-panel/filter-panel.component';
import { PaginationComponent } from './Components/pagination/pagination.component';
import { ErrorPopupComponent } from './Components/error-popup/error-popup.component';
import { ErrorHandlerService } from './interceptors/error-handler.service';
import { ForbiddenPageComponent } from './Components/forbidden-page/forbidden-page.component';
import { ResourceNotAvailableComponent } from './Components/resource-not-available/resource-not-available.component';
import { InfoCardComponent } from './Components/info-card/info-card.component';
import { PhoneNumberComponent } from './Components/phone-number/phone-number.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ProjectsPageComponent } from './Components/projects-page/projects-page.component';
import { ProjectsTableComponent } from './Components/projects-page/projects-table/projects-table.component';
import { ProjectionsFilterComponent } from './Components/projections-filter/projections-filter.component';
import { AddResourcesComponent } from './Components/projects-page/add-resources/add-resources.component';
import { ManageResourcesComponent } from './Components/projects-page/manage-resources/manage-resources.component';
import { ManageSkillsComponent } from './Components/projects-page/manage-skills/manage-skills.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReportsPageComponent } from './Components/reports-page/reports-page.component';
import { SummaryCardComponent } from './Components/reports-page/summary-card/summary-card.component';
import { SummaryBarChartComponent } from './Components/reports-page/summary-bar-chart/summary-bar-chart.component';
import { SummaryPieChartComponent } from './Components/reports-page/summary-pie-chart/summary-pie-chart.component';
import { SummaryPolarAreaChartComponent } from './Components/reports-page/summary-polar-area-chart/summary-polar-area-chart.component';
import { KeyOpportunitiesComponent } from './Components/reports-page/key-opportunities/key-opportunities.component';
import { FunnelChartComponent } from './Components/reports-page/funnel-chart/funnel-chart.component';
import { StackedBarChartComponent } from './Components/reports-page/stacked-bar-chart/stacked-bar-chart.component';
import { ConfirmDetailsComponent } from './Components/opportunity/confirm-details/confirm-details.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UserComponent,
    LoginComponent,
    RegistrationComponent,
    SidebarHeaderComponent,
    SidebarItemComponent,
    SidebarItemsComponent,
    SidebarComponent,
    TopbarComponent,
    TableComponent,
    OpportunityComponent,
    CustomerPageComponent,
    AddNewCustomerComponentComponent,
    EditCustomerModalComponent,
    ContactsPageComponent,
    AddNewContactButtonComponent,
    EditContactModalComponent,
    AddNewOpportunityComponent,
    OpportunityTableComponent,
    SearchComponent,
    FilterPanelComponent,
    PaginationComponent,
    ErrorPopupComponent,
    ForbiddenPageComponent,
    ResourceNotAvailableComponent,
    InfoCardComponent,
    PhoneNumberComponent,
    ProjectsPageComponent,
    ProjectsTableComponent,
    ProjectionsFilterComponent,
    AddResourcesComponent,
    ManageResourcesComponent,
    ManageSkillsComponent,
    ReportsPageComponent,
    SummaryCardComponent,
    SummaryBarChartComponent,
    SummaryPieChartComponent,
    SummaryPolarAreaChartComponent,
    KeyOpportunitiesComponent,
    FunnelChartComponent,
    StackedBarChartComponent,
    ConfirmDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxMaskDirective,
    FontAwesomeModule,
    NgChartsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: ErrorHandlerService,
      multi: true
    },
    provideNgxMask()   
  ],
  bootstrap: [AppComponent, ErrorPopupComponent]
})
export class AppModule { }
