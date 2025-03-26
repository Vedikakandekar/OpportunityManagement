import { Component, OnInit, HostListener } from '@angular/core';
import { AnalyticsData, KeyMetrics, SalesRepPipeline, StageFunnelData } from 'src/app/Models/Reports';
import { ReportsServiceService } from 'src/app/Services/reports-service.service';
import { OpportunityStatus, OpportunityStage, Opportunity } from 'src/app/Models/Opportunity';
import { faChartLine, faUser, faMoneyBill, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { SummaryPolarAreaChartComponent } from './summary-polar-area-chart/summary-polar-area-chart.component';
import { Customer } from '../../Models/Customer';

@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.css'],
  standalone: false
})
export class ReportsPageComponent implements OnInit {
  protected OpportunityStatus = OpportunityStatus;
  protected OpportunityStage = OpportunityStage;
  
  keyMetrics: KeyMetrics;
  analyticsData: AnalyticsData;
  currentQuarterMonths: string[] = [];
  monthlyDealValues: number[] = [];
  monthlyDealCounts: number[] = [];
  opportunityStatusCounts: number[] = [];
  resourceRequirements: { name: string; count: number }[] = [];
  customers: Customer[] = [];
  keyOpportunities: any[] = [];
  opportunityStageData: StageFunnelData[] = [];
  salesRepPipelineData: SalesRepPipeline[] = [];
  
  // Computed properties for charts
  get resourceRequirementCounts(): number[] {
    return this.resourceRequirements.map(r => r.count);
  }

  get resourceRequirementLabels(): string[] {
    return this.resourceRequirements.map(r => r.name);
  }
  
  iconMap = {
    user: faUser,
    chartLine: faChartLine,
    moneyBill: faMoneyBill,
    chartBar: faChartBar
  };

  constructor(private reportsService: ReportsServiceService) {}

  ngOnInit(): void {
    this.generateCurrentQuarterData();
    this.fetchKeyMetrics();
    this.fetchAnalyticsData();
  }

  @HostListener('window:resize')
  onResize() {
    // Trigger resize events for all charts
    const event = new Event('resize');
    window.dispatchEvent(event);
  }

  fetchKeyMetrics(): void {
    this.reportsService.getKeyMetrics().subscribe((reports) => {
      this.keyMetrics = reports.result;
    });
  }

  fetchAnalyticsData(): void {
    this.reportsService.getAnalyticsData().subscribe((reports) => {
      this.analyticsData = reports.result;
      this.monthlyDealValues = this.analyticsData.monthlyDealValuation;
      this.monthlyDealCounts = this.analyticsData.monthlyDealCount;
      this.opportunityStatusCounts = this.analyticsData.opportunityStatusCounts;
      this.resourceRequirements = this.analyticsData.resourceRequirements;
      this.keyOpportunities = this.analyticsData.keyOpportunities;

      // Use the sales rep pipeline data directly from backend
      this.salesRepPipelineData = Array.from(this.analyticsData.salesRepPipelineData.values())
        .sort((a, b) => {
          const totalA = Object.values(a.stageValues).reduce((sum, val) => sum + val, 0);
          const totalB = Object.values(b.stageValues).reduce((sum, val) => sum + val, 0);
          return totalB - totalA;
        });

      const stageMap = new Map<OpportunityStage, StageFunnelData>();
      for (const key in this.analyticsData.stageFunnel) {
        stageMap.set(key as OpportunityStage, this.analyticsData.stageFunnel[key]);
      }
      this.opportunityStageData = Array.from(stageMap.values())
        .filter(data => data.count > 0)
        .sort((a, b) => b.count - a.count);
    });
  }

  private generateCurrentQuarterData() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentQuarter = Math.floor(currentMonth / 3);
    const quarterStartMonth = currentQuarter * 3;

    for (let i = 0; i < 3; i++) {
      const monthIndex = (quarterStartMonth + i) % 12;
      const monthName = new Date(now.getFullYear(), monthIndex, 1)
        .toLocaleString('default', { month: 'long' });
      this.currentQuarterMonths.push(monthName);
    }
  }
}
