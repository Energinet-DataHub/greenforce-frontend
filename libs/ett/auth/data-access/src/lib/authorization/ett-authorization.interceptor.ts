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
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Displays an error when the user has insufficient permissions.
 */
@Injectable()
export class EttAuthorizationInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(
    request: HttpRequest<unknown>,
    nextHandler: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request.responseType;
    return nextHandler.handle(request).pipe(
      tap({
        error: (error) => {
          if (this.#is403ForbiddenResponse(error)) {
            this.#displayPermissionError();
          }
        },
      })
    );
  }

  #displayPermissionError(): Observable<void> {
    return this.snackBar
      .open('You do not have permission to perform this action.')
      .afterOpened();
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
