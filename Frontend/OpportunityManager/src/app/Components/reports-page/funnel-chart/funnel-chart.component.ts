import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { OpportunityStage } from 'src/app/Models/Opportunity';

interface StageData {
  stage: OpportunityStage;
  count: number;
  valuation: number;
}

@Component({
  selector: 'app-funnel-chart',
  templateUrl: './funnel-chart.component.html',
  styleUrls: ['./funnel-chart.component.css']
})
export class FunnelChartComponent implements OnInit, OnChanges {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  @Input() stageData: StageData[] = [];

  public chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#FF6384', // Prospecting
          '#36A2EB', // Qualification
          '#FFCE56', // Requirements
          '#4BC0C0', // Proposal
          '#9966FF', // Negotiation
          '#FF9F40', // Closed
          '#FF6384'  // PostSales
        ],
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1
      }
    ]
  };

  public chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Sales Pipeline',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const data = this.stageData[context.dataIndex];
            return [
              `Count: ${data.count}`,
              `Valuation: $${data.valuation.toLocaleString()}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Stage'
        }
      }
    }
  };

  ngOnInit() {
    this.updateChartData();
  }

  ngOnChanges() {
    if (this.stageData) {
      this.updateChartData();
    }
  }

  private updateChartData() {
    if (!this.stageData || this.stageData.length === 0) return;

    // Sort data by count in descending order
    const sortedData = [...this.stageData].sort((a, b) => b.count - a.count);

    this.chartData.labels = sortedData.map(d => d.stage);
    this.chartData.datasets[0].data = sortedData.map(d => d.count);

    if (this.chart) {
      this.chart.update();
    }
  }
}
