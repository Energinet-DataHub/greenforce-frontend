# Cookie information utilities

This service provides an easy way to integrate the Cookie Information consent banner.
> *documentation details of cookie information itself can be found [here](https://support.cookieinformation.com/en/).*

**🚨 Please notice:** It currently only supports English (en) and Danish (da) languages. To add another language, read [here](#add-support-for-other-languages).

**🚨 Please notice:** [Cookie information does **NOT** support testing the solution on localhost](https://support.cookieinformation.com/en/articles/6718369-technical-faq#h_37636a716d).

## Getting started

Before you can use cookie information, you will need someone to add your domain(s) at cookieinformation.

## Usage

```ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { CookieInformationService } from '@energinet-datahub/gf/util-cookie-information';

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
  }
}
```

## Add support for other languages

Add the culture to `src/lib/supported-cultures.ts`.

>**Note:** available cultures can be found [here](https://support.cookieinformation.com/en/articles/5444177-pop-up-implementation#h_8e9379fa2f).
