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
import { Injectable, makeEnvironmentProviders } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

import { WattDataIntlService } from '@energinet-datahub/watt/data';
import { WattFieldIntlService } from '@energinet-datahub/watt/field';
import { WattPaginatorIntlService } from '@energinet-datahub/watt/table';
import { WattClipboardIntlService } from '@energinet-datahub/watt/clipboard';
import { WattPhoneFieldIntlService } from '@energinet-datahub/watt/phone-field';
import { WattDatepickerIntlService } from '@energinet-datahub/watt/picker/datepicker';

@Injectable()
export class DhClipboardIntlService extends WattClipboardIntlService {
  constructor(transloco: TranslocoService) {
    super();

    transloco.selectTranslate('clipboard.success').subscribe((value) => (this.success = value));

    transloco.selectTranslate('clipboard.error').subscribe((value) => (this.error = value));
  }
}

@Injectable()
export class DhDatepickerIntlService extends WattDatepickerIntlService {
  constructor(transloco: TranslocoService) {
    super();

    transloco.selectTranslate('datepicker.clear').subscribe((value) => (this.clear = value));
    transloco.selectTranslate('datepicker.select').subscribe((value) => (this.select = value));
  }
}

@Injectable()
export class DhDataIntlService extends WattDataIntlService {
  constructor(transloco: TranslocoService) {
    super();

    transloco.selectTranslateObject('shared').subscribe((translations) => {
      this.search = translations.search;
      this.emptyTitle = translations.empty.title;
      this.emptyMessage = translations.empty.message;
      this.errorTitle = translations.error.title;
      this.errorMessage = translations.error.message;
      this.changes.next();
    });
  }
}

@Injectable()
export class DhFieldIntlService extends WattFieldIntlService {
  constructor(transloco: TranslocoService) {
    super();

    transloco.selectTranslateObject('shared.fieldValidation').subscribe((translations) => {
      this.required = translations.required;
      this.changes.next();
    });
  }
}

@Injectable()
export class DhPhoneFieldIntlService extends WattPhoneFieldIntlService {
  constructor(transloco: TranslocoService) {
    super();

    transloco.selectTranslateObject('shared.fieldValidation').subscribe((translations) => {
      this.invalidPhoneNumber = translations.invalidPhoneNumber;
      this.changes.next();
    });

    transloco.selectTranslateObject('shared.countries').subscribe((translations) => {
      this.DK = translations.DK;
      this.NO = translations.NO;
      this.SE = translations.SE;
      this.DE = translations.DE;
      this.FI = translations.FI;
      this.PL = translations.PL;
      this.changes.next();
    });
  }
}

@Injectable()
export class DhPaginatorIntlService extends WattPaginatorIntlService {
  constructor(transloco: TranslocoService) {
    super();

    transloco.selectTranslateObject('shared.paginator').subscribe((translations) => {
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

export const dhWattTranslationsProviders = makeEnvironmentProviders([
  {
    provide: WattClipboardIntlService,
    useClass: DhClipboardIntlService,
  },
  {
    provide: WattDataIntlService,
    useClass: DhDataIntlService,
  },
  {
    provide: WattPaginatorIntlService,
    useClass: DhPaginatorIntlService,
  },
  {
    provide: WattFieldIntlService,
    useClass: DhFieldIntlService,
  },
  {
    provide: WattPhoneFieldIntlService,
    useClass: DhPhoneFieldIntlService,
  },
  {
    provide: WattDatepickerIntlService,
    useClass: DhDatepickerIntlService,
  },
]);
