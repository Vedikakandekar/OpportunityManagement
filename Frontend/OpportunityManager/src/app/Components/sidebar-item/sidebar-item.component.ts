import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.css']
})
export class SidebarItemComponent {
  @Input() title: string = '';
  @Input() routerLink: string = '';

  constructor(private router: Router) {}

  isActive(): boolean {
    return this.router.url === this.routerLink;
  }
}
