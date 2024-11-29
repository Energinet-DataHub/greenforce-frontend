import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_NATIVE_DATE_FORMATS,
} from '@angular/material/core';
import { makeEnvironmentProviders } from '@angular/core';

import { WattDateAdapter } from './watt-date-adapter';

export const danishDatetimeProviders = makeEnvironmentProviders([
  { provide: MAT_DATE_LOCALE, useValue: 'da' },
  {
    provide: DateAdapter,
    useClass: WattDateAdapter,
    deps: [MAT_DATE_LOCALE],
  },
  { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
]);
