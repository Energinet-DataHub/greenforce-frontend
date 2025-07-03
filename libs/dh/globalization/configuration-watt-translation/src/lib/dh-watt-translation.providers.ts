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
import { WattDropZoneIntlService } from '@energinet-datahub/watt/dropzone';
import { WattFieldIntlService } from '@energinet-datahub/watt/field';
import { WattPaginatorIntlService } from '@energinet-datahub/watt/paginator';
import { WattClipboardIntlService } from '@energinet-datahub/watt/clipboard';
import { WattPhoneFieldIntlService } from '@energinet-datahub/watt/phone-field';
import { WattDatepickerIntlService } from '@energinet-datahub/watt/datepicker';

@Injectable()
export class DhClipboardIntlService extends WattClipboardIntlService {
  private readonly transloco = inject(TranslocoService);
  constructor() {
    super();
    this.transloco
      .selectTranslate('clipboard.success')
      .subscribe((value) => (this.success = value));
    this.transloco.selectTranslate('clipboard.error').subscribe((value) => (this.error = value));
  }
}

@Injectable()
export class DhDatepickerIntlService extends WattDatepickerIntlService {
  private readonly transloco = inject(TranslocoService);
  constructor() {
    super();

    this.transloco.selectTranslate('datepicker.clear').subscribe((value) => (this.clear = value));
    this.transloco.selectTranslate('datepicker.select').subscribe((value) => (this.select = value));
  }
}

@Injectable()
export class DhDataIntlService extends WattDataIntlService {
  private readonly transloco = inject(TranslocoService);
  constructor() {
    super();

    this.transloco.selectTranslateObject('shared.data').subscribe((translations) => {
      this.search = translations.search;
      this.emptyTitle = translations.empty.title;
      this.emptyText = translations.empty.text;
      this.errorTitle = translations.error.title;
      this.errorText = translations.error.text;
      this.defaultTitle = translations.default.title;
      this.defaultText = translations.default.text;
      this.changes.next();
    });
  }
}

@Injectable()
export class DhFieldIntlService extends WattFieldIntlService {
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
export class DhPhoneFieldIntlService extends WattPhoneFieldIntlService {
  private readonly transloco = inject(TranslocoService);
  constructor() {
    super();

    this.transloco.selectTranslateObject('shared.fieldValidation').subscribe((translations) => {
      this.invalidPhoneNumber = translations.invalidPhoneNumber;
      this.changes.next();
    });

    this.transloco.selectTranslateObject('shared.countries').subscribe((translations) => {
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

@Injectable()
export class DhDropZoneIntlService extends WattDropZoneIntlService {
  private readonly transloco = inject(TranslocoService);
  constructor() {
    super();

    this.transloco.selectTranslateObject('dropzone').subscribe((translations) => {
      this.prompt = translations.prompt;
      this.promptMultiple = translations.promptMultiple;
      this.separator = translations.separator;
      this.button = translations.button;
      this.buttonMultiple = translations.buttonMultiple;
      this.loadingMessage = translations.loadingMessage;
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
  {
    provide: WattDropZoneIntlService,
    useClass: DhDropZoneIntlService,
  },
]);
