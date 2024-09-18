# Cookie information utilities

This service provides an easy way to integrate the Cookie Information consent banner.
> *documentation details of cookie information itself can be found [here](https://support.cookieinformation.com/en/).*

**🚨 Please notice:** It currently only supports English (en) and Danish (da) languages. To add another language, read [here](#add-support-for-other-languages).

**🚨 Please notice:** [Cookie information does **NOT** support testing the solution on localhost](https://support.cookieinformation.com/en/articles/6718369-technical-faq#h_37636a716d). However you can make a workaround by creating a reverse proxy and test some of the functionality.

**🚨 Please notice:** [Cookies on-password protected sites, needs to be added manually](https://support.cookieinformation.com/en/articles/6718369-technical-faq#h_19d9f5db85).

## Getting started

Before you can use cookie information, you will need someone to add your domain(s) at cookieinformation.

## Usage

```ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import {
  CookieInformationService,
  CookieInformationCulture,
  COOKIE_CATEGORIES,
} from '@energinet-datahub/gf/util-cookie-information';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  private cookieInformationService: CookieInformationService = inject(CookieInformationService);
  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // Initialize cookie information
    this.cookieInformationService.init({
      culture: this.transloco.getActiveLang() as CookieInformationCulture,
    });

    // Reload cookie information on language changes
    this.transloco.langChanges$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((lang) => {
      this.cookieInformationService.reInit({
        culture: lang as CookieInformationCulture,
      });
    });

    // Get the initial consent status and future changes
    this.cookieInformationService.consentGiven$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((status) => {
        console.log('Consent status by cookie categories:', status);
      });

    // Get current consent of all cookie categories
    console.log(
      this.cookieInformationService.getConsentStatus()
    );

    // Get the current cosent of specified cookie category
    console.log(
      'Cookie consent given for marketing:',
      this.cookieInformationService.isConsentGiven(COOKIE_CATEGORIES.MARKETING)
    );
  }

  // Primarily used for a custom "renew" button
  openCookieDialog() {
    this.cookieInformationService.openDialog();
  }
}
```

## Add support for other languages

Add the culture to `src/lib/supported-cultures.ts`.

>**Note:** available cultures can be found [here](https://support.cookieinformation.com/en/articles/5444177-pop-up-implementation#h_8e9379fa2f).

## Positioning of the "renew" button

Here's an example of moving the "renew" button from bottom left corner to bottom right corner

```css
// Global style
#cookie-information-template-wrapper #Coi-Renew {
  right: 0px;
  left: initial;
  border-top-left-radius: 50%;
  border-top-right-radius: 0px;
  transform-origin: right bottom;
}
```

## Custom "renew" button

To have a custom "renew" button, start by hiding the default button

```css
// Global style
#cookie-information-template-wrapper #Coi-Renew {
  display: none;
}
```

Then insert your custom button, which calls `openDialog()` on the CookieInformationService.
