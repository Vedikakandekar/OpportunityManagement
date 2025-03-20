import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-summary-polar-area-chart',
  templateUrl: './summary-polar-area-chart.component.html',
  styleUrls: ['./summary-polar-area-chart.component.css']
})
export class SummaryPolarAreaChartComponent implements OnInit, OnChanges {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @Input() chartName: string = 'Resource Requirements';
  @Input() skills: { name: string; count: number }[] = [];
  public donutChartType: ChartType = 'doughnut';
  public donutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',   // Blue for .NET
        'rgba(255, 99, 132, 0.8)',    // Red for Python
        'rgba(75, 192, 192, 0.8)',    // Teal for Java
        'rgba(255, 206, 86, 0.8)',    // Yellow for JavaScript
        'rgba(153, 102, 255, 0.8)',   // Purple for SQL
        'rgba(255, 159, 64, 0.8)',    // Orange for React
        'rgba(76, 175, 80, 0.8)',     // Green for Angular
        'rgba(233, 30, 99, 0.8)',     // Pink for DevOps
        'rgba(0, 188, 212, 0.8)',     // Cyan for AWS
        'rgba(139, 195, 74, 0.8)'     // Light Green for Azure
      ],
      borderColor: [
        'rgb(54, 162, 235)',
        'rgb(255, 99, 132)',
        'rgb(75, 192, 192)',
        'rgb(255, 206, 86)',
        'rgb(153, 102, 255)',
        'rgb(255, 159, 64)',
        'rgb(76, 175, 80)',
        'rgb(233, 30, 99)',
        'rgb(0, 188, 212)',
        'rgb(139, 195, 74)'
      ],
      borderWidth: 2,
      hoverOffset: 5
    }]
  };

  public donutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    radius: '90%',
    cutout: '70%',
    layout: {
      padding: {
        right: 20
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'right',
        align: 'center',
        labels: {
          boxWidth: 15,
          boxHeight: 15,
          padding: 10,
          font: {
            size: 11,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels?.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const backgroundColor = data.datasets[0].backgroundColor?.[i];
                const borderColor = data.datasets[0].borderColor?.[i];
                
                return {
                  text: `${label} (${value})`,
                  fillStyle: backgroundColor,
                  strokeStyle: borderColor,
                  lineWidth: 1,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        },
        onClick: function() {} // Disable legend click to prevent hiding data
      },
      title: {
        display: true,
        text: this.chartName,
        font: {
          size: 16,
          weight: 'bold',
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
        },
        padding: { bottom: 20 },
        color: '#2c3e50'
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#2c3e50',
        bodyColor: '#34495e',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const total = context.dataset.data.reduce((acc, curr) => Number(acc) + Number(curr), 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} Resources (${percentage}%)`;
          }
        }
      }
    }
  };

  private chartColors: string[] = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
  ];

  ngOnInit(): void {
    this.updateChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['skills']) {
      this.updateChartData();
    }
    
    setTimeout(() => {
      if (this.chart) {
        this.chart.update();
      }
    });
  }

  private updateChartData(): void {
    if (this.skills && this.skills.length > 0) {
      // Sort skills by count in descending order
      const sortedSkills = [...this.skills].sort((a, b) => b.count - a.count);
      
      this.donutChartData.labels = sortedSkills.map(skill => skill.name);
      this.donutChartData.datasets[0].data = sortedSkills.map(skill => skill.count);

      setTimeout(() => {
        if (this.chart) {
          this.chart.update();
        }
      });
    }
  }

  getSkillColor(skillName: string): string {
    const index = this.skills.findIndex(skill => skill.name === skillName);
    return this.chartColors[index % this.chartColors.length];
  }
} 