import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { first, map } from 'rxjs';

interface ServiceProviderTermsResponse {
  termsAccepted: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ServiceProviderTermsService {
  #apiEnvironment: EoApiEnvironment = inject(eoApiEnvironmentToken);
  #http: HttpClient = inject(HttpClient);
  #apiBase = this.#apiEnvironment.apiBase;
  public serviceProviderTermsAccepted = signal<boolean>(false);

  constructor() {
    this.getServiceProviderTerms();
  }

  private getServiceProviderTerms() {
    return this.#http
      .get<ServiceProviderTermsResponse>(`${this.#apiBase}/authorization/service-provider-terms`)
      .pipe(
        map((x) => x.termsAccepted),
        first()
      )
      .subscribe((termsAccepted) => {
        this.serviceProviderTermsAccepted.set(termsAccepted);
      });
  }

  acceptServiceProviderTerms() {
    return this.#http.post(`${this.#apiBase}/authorization/service-provider-terms`, null);
  }
}
