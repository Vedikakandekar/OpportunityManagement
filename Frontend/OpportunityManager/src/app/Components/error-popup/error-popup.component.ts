import { Component } from '@angular/core';
import { ErrorPopupService } from 'src/app/Services/error-popup.service';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.css']
})
export class ErrorPopupComponent {
  constructor(public errorPopupService: ErrorPopupService) {}
}
