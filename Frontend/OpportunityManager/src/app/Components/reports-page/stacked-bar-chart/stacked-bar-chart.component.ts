import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { OpportunityStage } from 'src/app/Models/Opportunity';

interface SalesRepPipeline {
  name: string;
  stageValues: {
    [key in OpportunityStage]?: number;
  };
}

@Component({
  selector: 'app-stacked-bar-chart',
  templateUrl: './stacked-bar-chart.component.html',
  styleUrls: ['./stacked-bar-chart.component.css']
})
export class StackedBarChartComponent implements OnInit, OnChanges {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  @Input() salesRepData: SalesRepPipeline[] = [];

  public chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  public chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 5,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Sales Pipeline by Sales Rep',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const stage = context.dataset.label as OpportunityStage;
            const value = context.raw as number;
            return `${stage}: $${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value ($)',
          font: {
            weight: 'bold'
          }
        },
        ticks: {
          callback: (value) => `$${(+value / 1000000).toFixed(1)}M`
        }
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Sales Representatives',
          font: {
            weight: 'bold'
          }
        }
      }
    }
  };

  ngOnInit() {
    this.updateChartData();
  }

  ngOnChanges() {
    if (this.salesRepData) {
      this.updateChartData();
    }
  }

  private updateChartData() {
    if (!this.salesRepData || this.salesRepData.length === 0) return;

    // Get all unique stages
    const stages = Array.from(new Set(
      this.salesRepData.flatMap(rep => Object.keys(rep.stageValues) as OpportunityStage[])
    ));

    // Prepare datasets
    const datasets = stages.map((stage, index) => ({
      label: stage,
      data: this.salesRepData.map(rep => rep.stageValues[stage] || 0),
      backgroundColor: this.getStageColor(index),
      borderColor: 'rgba(0, 0, 0, 0.8)',
      borderWidth: 1,
      borderRadius: 4,
      barThickness: 40
    }));

    this.chartData = {
      labels: this.salesRepData.map(rep => rep.name),
      datasets
    };

    if (this.chart) {
      this.chart.update();
    }
  }

  private getStageColor(index: number): string {
    const colors = [
      '#FF6384', // Prospecting
      '#36A2EB', // Qualification
      '#FFCE56', // Requirements
      '#4BC0C0', // Proposal
      '#9966FF', // Negotiation
      '#FF9F40', // Closed
      '#FF6384'  // PostSales
    ];
    return colors[index % colors.length];
  }
}