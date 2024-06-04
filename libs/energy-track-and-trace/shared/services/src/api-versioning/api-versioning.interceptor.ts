
import { Inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EttApiEnvironment, EttApiEnvironmentToken } from '@energinet-datahub/ett/shared/environments';

@Injectable()
export class EttApiVersioningInterceptor implements HttpInterceptor {
  constructor(@Inject(EttApiEnvironmentToken) private apiEnvironment: EttApiEnvironment) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(request.url.includes('assets') || request.url.includes('wallet-api')) return next.handle(request);

    const apiVersions = this.apiEnvironment.apiVersions;
    const versionedPaths = Object.keys(apiVersions);
    const isVersioned = versionedPaths.find((path) => {
      return request.url.includes(`/${path}`)
    });

    if(isVersioned) {
      const modifiedRequest = request.clone({
        setHeaders: {
          'EO_API_VERSION': apiVersions[isVersioned],
        }
      });
      return next.handle(modifiedRequest);
    } else {
      return next.handle(request);
    }
  }
}

export const ettApiVersioningInterceptorProvider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: EttApiVersioningInterceptor,
};
