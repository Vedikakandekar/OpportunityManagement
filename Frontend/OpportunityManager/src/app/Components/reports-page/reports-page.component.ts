import { Component, OnInit } from '@angular/core';
import { AnalyticsData, KeyMetrics } from 'src/app/Models/Reports';
import { ReportsServiceService } from 'src/app/Services/reports-service.service';
import { OpportunityStatus } from 'src/app/Models/Opportunity';
import { faChartLine, faUser, faMoneyBill, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { SummaryPolarAreaChartComponent } from './summary-polar-area-chart/summary-polar-area-chart.component';
import { Opportunity } from '../../Models/Opportunity';
import { Customer } from '../../Models/Customer';

@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.css'],
  standalone: false
})
export class ReportsPageComponent implements OnInit {
  protected OpportunityStatus = OpportunityStatus;
  
  keyMetrics: KeyMetrics;
  analyticsData: AnalyticsData;
  currentQuarterMonths: string[] = [];
  monthlyDealValues: number[] = [];
  monthlyDealCounts: number[] = [];
  opportunityStatusCounts: number[] = [];
  resourceRequirements: { name: string; count: number }[] = [];
  customers: Customer[] = [];
  keyOpportunities: any[] = [];
  iconMap = {
    user: faUser,
    chartLine: faChartLine,
    moneyBill: faMoneyBill,
    chartBar: faChartBar
  };

  constructor(private reportsService: ReportsServiceService) {

  }

  ngOnInit(): void {
    this.generateCurrentQuarterData();
    this.fetchKeyMetrics();
    this.fetchAnalyticsData();

  }

  fetchKeyMetrics(): void {
    this.reportsService.getKeyMetrics().subscribe((reports) => {
      this.keyMetrics = reports.result;
      console.log(this.keyMetrics);
    });
  }

  fetchAnalyticsData(): void {
    this.reportsService.getAnalyticsData().subscribe((reports) => {
      this.analyticsData = reports.result;
      console.log("analyticsData : ",this.analyticsData);
      this.monthlyDealValues = this.analyticsData.monthlyDealValuation;
      this.monthlyDealCounts = this.analyticsData.monthlyDealCount;
      this.opportunityStatusCounts = this.analyticsData.opportunityStatusCounts;
      this.resourceRequirements = this.analyticsData.resourceRequirements;
      this.keyOpportunities = this.analyticsData.keyOpportunities
      console.log("keyOpportunities : ",this.keyOpportunities);
    });
  }

  private generateCurrentQuarterData() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentQuarter = Math.floor(currentMonth / 3);
    const quarterStartMonth = currentQuarter * 3;

    // Get the last 3 months including current month
    for (let i = 0; i < 3; i++) {
      const monthIndex = (quarterStartMonth + i) % 12;
      const monthName = new Date(now.getFullYear(), monthIndex, 1)
        .toLocaleString('default', { month: 'long' });
      this.currentQuarterMonths.push(monthName);
    }
  }


}
