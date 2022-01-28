const baseUrl = Cypress.config().baseUrl;

if (baseUrl == null) {
  throw new Error('baseUrl is null');
}

const trimTrailingSlashes = (text: string) => text.replace(/\/+$/, '');

export const absoluteUrl = (relativeUrl: string) =>
  trimTrailingSlashes(`${baseUrl}${relativeUrl}`);
