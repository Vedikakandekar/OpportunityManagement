import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorPopupService {

  errorMessage: string = '';
  isVisible: boolean = false;
  messageType: 'error' | 'warning' = 'error';

  showErrorPopup(message: string, type: 'error' | 'warning' = 'error') {
    this.errorMessage = message;
    this.messageType = type;
    this.isVisible = true;

    // Auto-close after 3 seconds
    setTimeout(() => {
      this.isVisible = false;
    }, 3000);
  }

  hideErrorPopup() {
    this.isVisible = false;
  }
}
