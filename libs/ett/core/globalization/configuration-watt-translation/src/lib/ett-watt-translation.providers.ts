//#region License
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
//#endregion
import { Injectable, makeEnvironmentProviders, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { WattDataIntlService } from '@energinet-datahub/watt/data';
import { WattFieldIntlService } from '@energinet-datahub/watt/field';
import { WattPaginatorIntlService } from '@energinet-datahub/watt/paginator';
import { WattClipboardIntlService } from '@energinet-datahub/watt/clipboard';

@Injectable()
export class EttClipboardIntlService extends WattClipboardIntlService {
  private readonly transloco = inject(TranslocoService);
  constructor() {
    super();

    this.transloco
      .selectTranslate('shared.clipboard.success')
      .subscribe((value) => (this.success = value));
    this.transloco
      .selectTranslate('shared.clipboard.error')
      .subscribe((value) => (this.error = value));
  }
}

@Injectable()
export class EttDataIntlService extends WattDataIntlService {
  private readonly transloco = inject(TranslocoService);
  constructor() {
    super();

    this.transloco.selectTranslateObject('shared').subscribe((translations) => {
      this.search = translations.search;
      this.emptyTitle = translations.empty.title;
      this.emptyText = translations.empty.message;
      this.errorTitle = translations.error.title;
      this.errorText = translations.error.message;
      this.changes.next();
    });
  }
}

@Injectable()
export class EttFieldIntlService extends WattFieldIntlService {
  private readonly transloco = inject(TranslocoService);
  constructor() {
    super();

    this.transloco.selectTranslateObject('shared.fieldValidation').subscribe((translations) => {
      this.required = translations.required;
      this.changes.next();
    });
  }
}

@Injectable()
export class EttPaginatorIntlService extends WattPaginatorIntlService {
  private readonly transloco = inject(TranslocoService);
  constructor() {
    super();

    this.transloco.selectTranslateObject('shared.paginator').subscribe((translations) => {
      this.description = translations.ariaLabel;
      this.itemsPerPage = translations.itemsPerPageLabel;
      this.nextPage = translations.next;
      this.previousPage = translations.previous;
      this.firstPage = translations.first;
      this.lastPage = translations.last;
      this.of = translations.of;
      this.changes.next();
    });
  }
}

export const ettWattTranslationsProviders = makeEnvironmentProviders([
  {
    provide: WattClipboardIntlService,
    useClass: EttClipboardIntlService,
  },
  {
    provide: WattDataIntlService,
    useClass: EttDataIntlService,
  },
  {
    provide: WattPaginatorIntlService,
    useClass: EttPaginatorIntlService,
  },
  {
    provide: WattFieldIntlService,
    useClass: EttFieldIntlService,
  },
]);
