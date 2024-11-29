import { inject } from '@angular/core';
import { CanActivateFn, Route } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

const setDefaultLang: CanActivateFn = (RouterStateSnapshot) => {
  const transloco = inject(TranslocoService);
  transloco.setActiveLang(RouterStateSnapshot.url.toString());
  return true;
};

export const appRoutes: Route[] = [
  {
    path: 'en',
    loadChildren: () =>
      import('@energinet-datahub/eo/landing-page/shell').then(
        (esModule) => esModule.eoLandingPageRoutes
      ),
    canActivate: [setDefaultLang],
  },
  {
    path: 'da',
    loadChildren: () =>
      import('@energinet-datahub/eo/landing-page/shell').then(
        (esModule) => esModule.eoLandingPageRoutes
      ),
    canActivate: [setDefaultLang],
  },
  // Redirect from the root to the default language
  { path: '', redirectTo: getDefaultLanguage(), pathMatch: 'full' },
  { path: '**', redirectTo: '/' },
];

function getDefaultLanguage(): string {
  try {
    const lang = navigator.language.split('-')[0];
    return lang === 'da' ? 'da' : 'en';
  } catch (error) {
    return 'en';
  }
}
