import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { ClassProvider, Injectable } from '@angular/core';

import { DhActorTokenService } from './dh-actor-token.service';

@Injectable()
export class DhAuthorizationInterceptor implements HttpInterceptor {
  constructor(private actorTokenService: DhActorTokenService) {}

  intercept(
    request: HttpRequest<unknown>,
    nextHandler: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.hasAuthorizationHeader(request)) {
      return nextHandler.handle(request);
    }

    if (this.actorTokenService.isPartOfAuthFlow(request)) {
      return this.actorTokenService.handleAuthFlow(request, nextHandler);
    }

    return this.actorTokenService.acquireToken().pipe(
      switchMap((internalToken) => {
        return nextHandler.handle(
          request.clone({
            headers: request.headers.set('Authorization', `Bearer ${internalToken}`),
          })
        );
      })
    );
  }

  private hasAuthorizationHeader(request: HttpRequest<unknown>): boolean {
    const authorizationHeader = 'Authorization';
    const externalToken = request.headers.get(authorizationHeader);
    return !!externalToken;
  }
}

export const dhAuthorizationInterceptor: ClassProvider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: DhAuthorizationInterceptor,
};
