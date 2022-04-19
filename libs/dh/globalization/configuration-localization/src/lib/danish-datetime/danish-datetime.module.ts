import { NgModule } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  DateFnsAdapter,
  MatDateFnsModule,
  MAT_DATE_FNS_FORMATS,
} from '@angular/material-date-fns-adapter';
import * as daLocale from 'date-fns/locale/da/index.js';

@NgModule({
  imports: [MatDateFnsModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: daLocale },
    {
      provide: DateAdapter,
      useClass: DateFnsAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FNS_FORMATS },
  ],
})
export class DanishDatetimeModule {}
