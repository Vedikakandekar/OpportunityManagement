import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  @Input() columns: { key: string; label: string }[] = []; 
  @Input() data: any[] = []; 
  @Input() showButtons: boolean = false;
  
  @Output() edit = new EventEmitter<any>();
  @Output() showDeals = new EventEmitter<any>();
  @Output() showContacts = new EventEmitter<any>();

  onEdit(row: any) {
    this.edit.emit(row); 
  }

  onShowDeals(row: any) {
    this.showDeals.emit(row);
  }

  onShowContacts(row: any) {
    this.showContacts.emit(row);
  }

  // Helper method to get label for a key
  getLabel(key: string): string {
    const column = this.columns.find(col => col.key === key);
    return column ? column.label : key;
  }

  // Helper method to get icon for a field
  getIconForField(key: string): string {
    const iconMap: { [key: string]: string } = {
      // Customer fields
      'name': 'bi bi-building',
      'customerName': 'bi bi-building',
      'companyName': 'bi bi-building',
      'email': 'bi bi-envelope',
      'mobile': 'bi bi-telephone',
      'designation': 'bi bi-person-badge',
      'phoneNumber': 'bi bi-telephone',
      'contactName': 'bi bi-person',
      'address': 'bi bi-geo-alt',
      'website': 'bi bi-globe',
      'industry': 'bi bi-briefcase',
      'type': 'bi bi-tag',
      'customerStatus': 'bi bi-circle-fill',
      'createdDate': 'bi bi-calendar',
      'lastModifiedDate': 'bi bi-clock',
      'createdBy': 'bi bi-person',
      'lastModifiedBy': 'bi bi-person',
      // Contact fields
      'firstName': 'bi bi-person',
      'lastName': 'bi bi-person',
      'title': 'bi bi-person-badge',
      'department': 'bi bi-diagram-3',
      'location': 'bi bi-geo-alt',
      'linkedIn': 'bi bi-linkedin',
      'twitter': 'bi bi-twitter',
      'facebook': 'bi bi-facebook',
      'instagram': 'bi bi-instagram',
      'notes': 'bi bi-card-text',
      'tags': 'bi bi-tags',
      'source': 'bi bi-funnel',
      'assignedTo': 'bi bi-person-check',
      'lastContact': 'bi bi-calendar-check',
      'nextContact': 'bi bi-calendar-plus',
      'priority': 'bi bi-flag',
      'contactStatus': 'bi bi-circle-fill',
      'createdAt': 'bi bi-calendar',
      'updatedAt': 'bi bi-clock',
      'contactCreatedBy': 'bi bi-person',
      'contactUpdatedBy': 'bi bi-person',
      // Default icon
      'default': 'bi bi-info-circle'
    };

    return iconMap[key] || iconMap['default'];
  }
}
