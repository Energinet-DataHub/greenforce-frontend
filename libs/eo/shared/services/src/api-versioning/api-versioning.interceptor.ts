
import { Inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';

@Injectable()
export class EoApiVersioningInterceptor implements HttpInterceptor {
  constructor(@Inject(eoApiEnvironmentToken) private apiEnvironment: EoApiEnvironment) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(request.url.includes('assets')) return next.handle(request);

    const apiVersions = this.apiEnvironment.apiVersions;
    const versionedPaths = Object.keys(apiVersions);

    const isVersioned = versionedPaths.find((path) => {
      if(request.url.includes('wallet-api') && path === 'wallet-api') return true;

      return request.url.startsWith(
        `${this.apiEnvironment.apiBase}/${path}`
      );
    });

    if(isVersioned) {
      const modifiedRequest = request.clone({
        setHeaders: {
          'X-API-Version': apiVersions[isVersioned],
        }
      });
      return next.handle(modifiedRequest);
    } else {
      return next.handle(request);
    }
  }
}

export const eoApiVersioningInterceptorProvider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: EoApiVersioningInterceptor,
};
