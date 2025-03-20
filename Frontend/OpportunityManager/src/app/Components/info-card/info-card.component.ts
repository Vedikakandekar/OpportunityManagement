import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.css']
})
export class InfoCardComponent {
  @Input() customerContactData: any; // Pass customer data
  @Input() visible: boolean = false; // Control visibility
  @Output() close = new EventEmitter<void>(); // Emit close event

  closeCard() {
    this.close.emit();
  }
}
