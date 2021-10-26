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
 * Redirects to the login page when the user has insufficient permissions.
 */
@Injectable()
export class EttAuthorizationInterceptor implements HttpInterceptor {
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
            this.#is403ForbiddenResponse(error)
              ? from(this.router.navigate([ettAuthRoutePath])).pipe(
                  switchMapTo(throwError(error))
                )
              : throwError(error)
        )
      );
  }

  #is403ForbiddenResponse(error: unknown): boolean {
    return (
      error instanceof HttpErrorResponse &&
      error.status === HttpStatusCode.Forbidden
    );
  }
}

export const ettAuthorizationInterceptorProvider: ClassProvider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: EttAuthorizationInterceptor,
};
