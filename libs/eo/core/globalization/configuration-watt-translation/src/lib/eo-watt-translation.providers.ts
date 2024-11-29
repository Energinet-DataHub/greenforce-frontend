import { Injectable, makeEnvironmentProviders } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

import { WattDataIntlService } from '@energinet-datahub/watt/data';
import { WattFieldIntlService } from '@energinet-datahub/watt/field';
import { WattPaginatorIntlService } from '@energinet-datahub/watt/paginator';
import { WattClipboardIntlService } from '@energinet-datahub/watt/clipboard';

@Injectable()
export class EoClipboardIntlService extends WattClipboardIntlService {
  constructor(transloco: TranslocoService) {
    super();

    transloco
      .selectTranslate('shared.clipboard.success')
      .subscribe((value) => (this.success = value));
    transloco.selectTranslate('shared.clipboard.error').subscribe((value) => (this.error = value));
  }
}

@Injectable()
export class EoDataIntlService extends WattDataIntlService {
  constructor(transloco: TranslocoService) {
    super();

    transloco.selectTranslateObject('shared').subscribe((translations) => {
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
export class EoFieldIntlService extends WattFieldIntlService {
  constructor(transloco: TranslocoService) {
    super();

    transloco.selectTranslateObject('shared.fieldValidation').subscribe((translations) => {
      this.required = translations.required;
      this.changes.next();
    });
  }
}

@Injectable()
export class EoPaginatorIntlService extends WattPaginatorIntlService {
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

export const eoWattTranslationsProviders = makeEnvironmentProviders([
  {
    provide: WattClipboardIntlService,
    useClass: EoClipboardIntlService,
  },
  {
    provide: WattDataIntlService,
    useClass: EoDataIntlService,
  },
  {
    provide: WattPaginatorIntlService,
    useClass: EoPaginatorIntlService,
  },
  {
    provide: WattFieldIntlService,
    useClass: EoFieldIntlService,
  },
]);
