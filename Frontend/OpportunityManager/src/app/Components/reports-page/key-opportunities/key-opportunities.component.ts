import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Opportunity, OpportunityStatus, OpportunityStage } from '../../../Models/Opportunity';

@Component({
  selector: 'app-key-opportunities',
  templateUrl: './key-opportunities.component.html',
  styleUrls: ['./key-opportunities.component.css']
})
export class KeyOpportunitiesComponent implements OnInit, OnChanges {
  @Input() opportunities: any[] = [];

  highPriorityOpportunities: any[] = [];

  ngOnInit(): void {
    this.updateOpportunities();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['opportunities']) {
      this.updateOpportunities();
    }
  }

  private updateOpportunities(): void {
    if (this.opportunities) {
      this.highPriorityOpportunities = [...this.opportunities]
        .sort((a, b) => {
          // Sort by confidence (descending) and then by value (descending)
          const confidenceOrder = { 'GuaranteedWin': 4, 'VeryPromising': 3, 'PotentialLead': 2, 'LongShot': 1, 'Unlikely': 0 };
          const confDiff = confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
          if (confDiff !== 0) return confDiff;
          return parseFloat(b.value) - parseFloat(a.value);
        });
    }
  }

  getConfidenceColor(confidence: string): string {
    const colors = {
      'GuaranteedWin': '#2ecc71',    // Professional green
      'VeryPromising': '#3498db',    // Classic blue
      'PotentialLead': '#f1c40f',    // Warm yellow
      'LongShot': '#e67e22',         // Orange
      'Unlikely': '#e74c3c'          // Red
    };
    return colors[confidence as keyof typeof colors] || '#95a5a6';
  }

  getStageColor(stage: OpportunityStage): string {
    const colors = {
      'Prospecting': '#34495e',      // Dark slate
      'Qualification': '#9b59b6',    // Purple
      'Requirements': '#1abc9c',     // Turquoise
      'Proposal': '#f39c12',         // Gold
      'Negotiation': '#16a085',      // Teal
      'Closed': '#7f8c8d',           // Gray
      'PostSales': '#8e44ad'         // Deep purple
    };
    return colors[stage] || '#95a5a6';
  }
} 