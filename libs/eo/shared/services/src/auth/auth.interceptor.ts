import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { ClassProvider, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { EoAuthService } from './auth.service';
import { EoAuthStore } from './auth.store';

@Injectable()
export class EoAuthorizationInterceptor implements HttpInterceptor {
  callsThatAllowRefresh = ['PUT', 'POST', 'DELETE'];

  constructor(
    private snackBar: MatSnackBar,
    private authService: EoAuthService,
    private authStore: EoAuthStore
  ) {}

  intercept(req: HttpRequest<unknown>, nextHandler: HttpHandler) {
    const request = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${this.authStore.token.getValue()}`),
    });
    return nextHandler.handle(request).pipe(
      tap({
        next: () => {
          if (this.callsThatAllowRefresh.includes(request.method)) {
            this.authService.refreshToken();
          }
        },
        error: (error) => {
          if (this.#is403ForbiddenResponse(error)) {
            this.#displayPermissionError();
          }
          if (this.#is401UnauthorizedResponse(error)) {
            this.authService.logout();
          }
        },
      })
    );
  }

  #displayPermissionError() {
    return this.snackBar.open('You do not have permission to perform this action.').afterOpened();
  }

  #is403ForbiddenResponse(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === HttpStatusCode.Forbidden;
  }

  #is401UnauthorizedResponse(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === HttpStatusCode.Unauthorized;
  }
}

export const eoAuthorizationInterceptorProvider: ClassProvider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: EoAuthorizationInterceptor,
};
