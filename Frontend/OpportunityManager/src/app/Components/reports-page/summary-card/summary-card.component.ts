import { Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChartLine, faUser, faMoneyBill, faChartBar, faPercent } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.css']
})

export class SummaryCardComponent {
  @Input() name: string = '';
  @Input() value: number = 0;
  @Input() unit: string = '';
  @Input() trend: string = '';
  @Input() icon: IconDefinition | undefined;
  @Input() showPercentage: boolean = false;
  // Icon mapping object
  private iconMap: { [key: string]: IconDefinition } = {
    'chart-line': faChartLine,
    'user': faUser,
    'money-bill': faMoneyBill,
    'chart-bar': faChartBar,
    'percent': faPercent
  };

  getIcon(): IconDefinition | undefined {
    return this.icon;
  }

  formatValue(value: number): string {
    if (isNaN(value)) return '0';

    // Handle percentage values
    if (this.unit === '%') {
      return value.toFixed(1);
    }

    // Handle currency values
    if (this.unit === '$') {
      if (value >= 1000000000) {
        return `$${(value / 1000000000).toFixed(1)}B`;
      }
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}K`;
      }
      return `$${value.toLocaleString()}`;
    }

    // Handle regular numbers
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }

    return value.toLocaleString();
  }
}




