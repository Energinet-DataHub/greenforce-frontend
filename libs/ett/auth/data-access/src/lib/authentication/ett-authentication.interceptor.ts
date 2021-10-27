import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { ClassProvider, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ettAuthRoutePath } from '@energinet-datahub/ett/auth/feature-shell';
import { from, Observable, throwError } from 'rxjs';
import { catchError, switchMapTo } from 'rxjs/operators';

/**
 * Redirects to the login page when the user is not authenticated or their
 * credentials have expired.
 */
@Injectable()
export class EttAuthenticationInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    nextHandler: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request.responseType;
    return nextHandler
      .handle(request)
      .pipe(
        catchError(
          (error: unknown): Observable<never> =>
            this.#is401UnauthorizedResponse(error)
              ? this.#navigateToLoginPage().pipe(switchMapTo(throwError(error)))
              : throwError(error)
        )
      );
  }

  #is401UnauthorizedResponse(error: unknown): boolean {
    return (
      error instanceof HttpErrorResponse &&
      error.status === HttpStatusCode.Unauthorized
    );
  }

  #navigateToLoginPage(): Observable<boolean> {
    return from(this.router.navigate([ettAuthRoutePath]));
  }
}

export const ettAuthenticationInterceptorProvider: ClassProvider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: EttAuthenticationInterceptor,
};
