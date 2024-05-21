/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
    this.#transloco.selectTranslateObject('landingPage.meta').subscribe((meta: typeof translations.landingPage.meta) => {
      this.#title.setTitle(meta.title);
      this.#meta.updateTag({ name: 'description', content: meta.description });
      this.#meta.updateTag({ name: 'keywords', content: meta.keywords });
      this.#meta.updateTag({ name: 'author', content: meta.author });

      // LinkedIn
      this.#meta.updateTag({ property: 'og:title', content: meta.title });
      this.#meta.updateTag({ property: 'og:description', content: meta.description });
      this.#meta.updateTag({ property: 'og:image', content: meta.url + '/assets/landing-page/linkedin-poster.jpg'});
      this.#meta.updateTag({ property: 'og:url', content: meta.url });
    });
  }
}
