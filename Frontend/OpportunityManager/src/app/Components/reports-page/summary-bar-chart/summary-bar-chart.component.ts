import { Component, Input, OnChanges, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-summary-bar-chart',
  templateUrl: './summary-bar-chart.component.html',
  styleUrls: ['./summary-bar-chart.component.css']
})
export class SummaryBarChartComponent implements OnInit, OnChanges {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  @Input() chartName: string = 'Monthly Revenue Trend';
  @Input() xAxisName: string = 'Timeline';
  @Input() yAxisName: string = 'Revenue';
  @Input() chartData: number[] = [];
  @Input() chartLabels: string[] = [];
  @Input() dealCounts: number[] = [];

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      ['x']: {
        type: 'category',
        display: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        title: {
          display: true,
          text: 'Monthly Timeline',
          font: {
            size: 14,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            weight: 'bold'
          },
          padding: 10,
          color: '#2c3e50'
        },
        ticks: {
          font: {
            size: 12,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
          },
          color: '#34495e'
        }
      },
      ['y']: {
        type: 'linear',
        display: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        title: {
          display: true,
          text: 'Monthly Revenue (USD)',
          font: {
            size: 14,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            weight: 'bold'
          },
          padding: 10,
          color: '#2c3e50'
        },
        ticks: {
          font: {
            size: 12,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
          },
          color: '#34495e',
          callback: function(value: any) {
            if (value >= 1000000) {
              return '$' + (value / 1000000).toFixed(1) + 'M';
            } else if (value >= 1000) {
              return '$' + (value / 1000).toFixed(1) + 'K';
            }
            return '$' + value;
          }
        },
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
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
        text: 'Monthly Revenue from Won Deals',
        font: {
          size: 18,
          weight: 'bold',
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
        },
        padding: {
          top: 20,
          bottom: 20
        },
        color: '#2c3e50'
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#2c3e50',
        titleFont: {
          size: 13,
          weight: 'bold',
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
        },
        bodyColor: '#34495e',
        bodyFont: {
          size: 12,
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
        },
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        callbacks: {
          title: (tooltipItems: any) => {
            return `Deals Summary for ${tooltipItems[0].label}`;
          },
          label: (context: any) => {
            const value = context.raw;
            const dataIndex = context.dataIndex;
            const dealCount = this.dealCounts[dataIndex];
            const formattedValue = value >= 1000000 
              ? `$${(value / 1000000).toFixed(2)}M`
              : value >= 1000 
                ? `$${(value / 1000).toFixed(2)}K` 
                : `$${value}`;
            
            return [
              `Total Deal Value: ${formattedValue}`,
              `Successful Deals: ${dealCount}`,
              `Average Deal Size: $${(value / dealCount).toLocaleString()}`
            ];
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 2,
        borderColor: 'rgb(52, 152, 219)',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        fill: true
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 6,
        backgroundColor: 'rgb(52, 152, 219)',
        borderColor: '#fff',
        borderWidth: 2,
        hoverBorderWidth: 2,
        hoverBackgroundColor: 'rgb(52, 152, 219)',
        hoverBorderColor: '#fff'
      }
    }
  };

  public lineChartType: ChartType = 'line';

  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Monthly Revenue',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderColor: 'rgb(52, 152, 219)',
        pointBackgroundColor: 'rgb(52, 152, 219)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(52, 152, 219)',
        fill: true
      }
    ]
  };

  ngOnInit(): void {
    this.updateChartData();
    this.updateChartOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] || changes['chartLabels'] || changes['dealCounts']) {
      this.updateChartData();
    }
    if (changes['chartName'] || changes['xAxisName'] || changes['yAxisName']) {
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
      this.lineChartData.labels = [...this.chartLabels];
      this.lineChartData.datasets[0].data = [...this.chartData];
      
      // Force chart update
      setTimeout(() => {
        if (this.chart) {
          this.chart.update();
        }
      });
    }
  }

  private updateChartOptions(): void {
    if (this.lineChartOptions?.scales?.['x']) {
      (this.lineChartOptions.scales['x'] as any).title.text = this.xAxisName;
    }
    if (this.lineChartOptions?.scales?.['y']) {
      (this.lineChartOptions.scales['y'] as any).title.text = this.yAxisName;
    }
    if (this.lineChartOptions?.plugins?.title) {
      this.lineChartOptions.plugins.title.text = this.chartName;
    }
    
    // Force chart update
    setTimeout(() => {
      if (this.chart) {
        this.chart.update();
      }
    });
  }
}
