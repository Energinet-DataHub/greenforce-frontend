import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { ClassProvider, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ettAuthRoutePath } from '@energinet-datahub/ett/auth/feature-shell';
import { EMPTY, Observable, of } from 'rxjs';
import { concatMapTo, switchMap } from 'rxjs/operators';

/**
 * Redirects to the login page when the user has not authenticated or their
 * credentials have expired.
 */
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    nextHandler: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request.responseType;
    return nextHandler
      .handle(request)
      .pipe(
        switchMap((event) =>
          this.#isUnauthorizedResponse(event)
            ? of(this.router.navigate([ettAuthRoutePath])).pipe(
                concatMapTo(EMPTY)
              )
            : of(event)
        )
      );
  }

  #isUnauthorizedResponse(event: HttpEvent<unknown>) {
    return (
      event instanceof HttpResponse &&
      event.status === HttpStatusCode.Unauthorized
    );
  }
}

export const authenticationInterceptorProvider: ClassProvider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: AuthenticationInterceptor,
};
