import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorPopupService } from '../Services/error-popup.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../Shared/Services/auth.service';
import { TOKEN_KEY } from '../Shared/constants';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements HttpInterceptor {

  constructor(private router: Router, private errorPopupService: ErrorPopupService, private userAuthService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.error);
        if (error.status === 401) { // Unauthorized - User not logged in
          localStorage.removeItem(TOKEN_KEY);
          this.router.navigate(['/Login']); // Redirect to login
          this.errorPopupService.showErrorPopup('Session expired. Please log in again.');
        }
        else if (error.status === 403) { // Forbidden - No access
          this.router.navigate(['/forbidden']);
          this.errorPopupService.showErrorPopup('You do not have permission to access this resource.'+error.error.message);
        }
        else if (error.status === 404) { // Not found
          this.router.navigate(['/not-found']);
          this.errorPopupService.showErrorPopup('Requested resource not found.');
        }
        else { // General error
          this.errorPopupService.showErrorPopup("Unexpected Error "+error.status+error.error.message);
        }
        return throwError(error);
      })
     
    );
  }

}
