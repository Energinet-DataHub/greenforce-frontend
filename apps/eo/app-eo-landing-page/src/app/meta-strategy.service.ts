import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TitleStrategy } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

import { translations } from '@energinet-datahub/eo/translations';

@Injectable()
export class MetaStrategy extends TitleStrategy {
  #transloco = inject(TranslocoService);
  #meta = inject(Meta);
  #title: Title = inject(Title);

  constructor() {
    super();
  }

  override updateTitle() {
    this.#transloco
      .selectTranslateObject('landingPage.meta')
      .subscribe((meta: typeof translations.landingPage.meta) => {
        this.#title.setTitle(meta.title);
        this.#meta.updateTag({ name: 'description', content: meta.description });
        this.#meta.updateTag({ name: 'keywords', content: meta.keywords });
        this.#meta.updateTag({ name: 'author', content: meta.author });

        // LinkedIn
        this.#meta.updateTag({ property: 'og:title', content: meta.title });
        this.#meta.updateTag({ property: 'og:description', content: meta.description });
        this.#meta.updateTag({
          property: 'og:image',
          content: meta.url + '/assets/landing-page/linkedin-poster.jpg',
        });
        this.#meta.updateTag({ property: 'og:url', content: meta.url });
      });
  }
}
