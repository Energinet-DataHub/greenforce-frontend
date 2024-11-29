import { HTTP_INTERCEPTORS, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ClassProvider, Injectable, inject } from '@angular/core';

import { eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';

import { EoActorService } from './actor.service';

@Injectable()
export class EoOrganizationIdInterceptor implements HttpInterceptor {
  private apiBase: string = inject(eoApiEnvironmentToken).apiBase;
  private actor = inject(EoActorService).actor;

  private apiBaseUrls = [this.apiBase, this.apiBase.replace('/api', '/wallet-api')];

  intercept(req: HttpRequest<unknown>, handler: HttpHandler) {
    // Only requests to the API should be handled by this interceptor
    if (!this.isApiRequest(this.apiBaseUrls, req)) return handler.handle(req);

    const currentActor = this.actor()?.org_id;
    if (!currentActor) return handler.handle(req);

    const modifiedReq = req.clone({
      setParams: {
        organizationId: currentActor,
      },
    });
    return handler.handle(modifiedReq);
  }

  private isApiRequest(apiBaseUrls: string[], req: HttpRequest<unknown>): boolean {
    return !!apiBaseUrls.find((apiBaseUrl) => {
      return req.url.startsWith(apiBaseUrl);
    });
  }
}

export const eoOrganizationIdInterceptorProvider: ClassProvider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: EoOrganizationIdInterceptor,
};
