import { CookieInformationCulture } from './supported-cultures';
import { COOKIE_CATEGORIES } from './cookie-information.constants';

declare global {
  interface Window {
    CookieInformation?: {
      loadConsent: () => void;
      getConsentGivenFor: (category: string) => boolean;
      renew: () => void;
    };
  }
}

export interface CookieInformationConfig {
  culture: CookieInformationCulture;
}

export type CookieCategory = (typeof COOKIE_CATEGORIES)[keyof typeof COOKIE_CATEGORIES];

export type ConsentStatus = {
  [K in CookieCategory]: boolean;
};
