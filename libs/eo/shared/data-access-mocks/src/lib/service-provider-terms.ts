import { http, HttpResponse } from 'msw';

export function serviceProviderTermsMocks(apiBase: string) {
  return [acceptServiceProviderTerms(apiBase), getServiceProviderTermsAccepted(apiBase)];
}

function acceptServiceProviderTerms(apiBase: string) {
  return http.post(`${apiBase}/authorization/service-provider-terms`, () => {
    return HttpResponse.json({ status: 200 });
  });
}

function getServiceProviderTermsAccepted(apiBase: string) {
  return http.get(`${apiBase}/authorization/service-provider-terms`, () => {
    const data = {
      termsAccepted: false,
    };
    return HttpResponse.json(data, { status: 200 });
  });
}
