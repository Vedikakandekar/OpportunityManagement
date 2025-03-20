import { Component, Input, OnChanges, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { OpportunityStatus } from 'src/app/Models/Opportunity';

@Component({
  selector: 'app-summary-pie-chart',
  templateUrl: './summary-pie-chart.component.html',
  styleUrls: ['./summary-pie-chart.component.css']
})
export class SummaryPieChartComponent implements OnInit, OnChanges {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  @Input() chartName: string = 'Opportunity Status Distribution';
  @Input() chartData: number[] = [];
  @Input() chartLabels: string[] = [];

  // Professional color scheme
  private statusColors = {
    [OpportunityStatus.Open]: {
      background: 'rgba(52, 152, 219, 0.8)',  // Professional blue
      border: 'rgb(52, 152, 219)'
    },
    [OpportunityStatus.ClosedWon]: {
      background: 'rgba(46, 204, 113, 0.8)',  // Success green
      border: 'rgb(46, 204, 113)'
    },
    [OpportunityStatus.ClosedLost]: {
      background: 'rgba(231, 76, 60, 0.8)',   // Elegant red
      border: 'rgb(231, 76, 60)'
    },
    [OpportunityStatus.Dropped]: {
      background: 'rgba(149, 165, 166, 0.8)', // Professional gray
      border: 'rgb(149, 165, 166)'
    },
    [OpportunityStatus.OnHold]: {
      background: 'rgba(243, 156, 18, 0.8)',  // Warning orange
      border: 'rgb(243, 156, 18)'
    }
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          font: {
            size: 13,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: this.chartName,
        font: {
          size: 18,
          weight: 'bold',
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
        },
        padding: 20,
        color: '#2c3e50'
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  public pieChartType: ChartType = 'pie';

  public pieChartData: ChartData<'pie'> = {
    labels: Object.values(OpportunityStatus),
    datasets: [{
      data: [],
      backgroundColor: Object.values(this.statusColors).map(color => color.background),
      borderColor: Object.values(this.statusColors).map(color => color.border),
      borderWidth: 2,
      hoverOffset: 10
    }]
  };

  ngOnInit(): void {
    this.updateChartData();
    this.updateChartOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] || changes['chartLabels']) {
      this.updateChartData();
    }
    if (changes['chartName']) {
      this.updateChartOptions();
    }
    
    // Force chart update
    setTimeout(() => {
      if (this.chart) {
        this.chart.update();
      }
    });
  }

  private updateChartData(): void {
    if (this.chartLabels && this.chartData) {
      this.pieChartData.labels = [...this.chartLabels];
      this.pieChartData.datasets[0].data = [...this.chartData];
      
      // Force chart update
      setTimeout(() => {
        if (this.chart) {
          this.chart.update();
        }
      });
    }
  }

  private updateChartOptions(): void {
    if (this.pieChartOptions?.plugins?.title) {
      this.pieChartOptions.plugins.title.text = this.chartName;
    }
    
    // Force chart update
    setTimeout(() => {
      if (this.chart) {
        this.chart.update();
      }
    });
  }
}
