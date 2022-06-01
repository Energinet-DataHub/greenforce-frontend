import { Inject, Optional } from "@angular/core";
import { DateFnsAdapter } from "@angular/material-date-fns-adapter";
import { MAT_DATE_LOCALE } from "@angular/material/core";

export class WattDateAdapter extends DateFnsAdapter {
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(@Optional() @Inject(MAT_DATE_LOCALE) matDateLocale: {}) {
    super(matDateLocale);
  }

  /**
   * This is necessary to remove the dots from the date (ordinals) for danish locale in the calendar view.
   * due to `Intl.DateTimeFormat`
   */
  getDateNames(): string[] {
    const dateNames = super.getDateNames();
    return this.locale.code === 'da'
      ? dateNames.map((dateName) => dateName.replace(/\./g, ''))
      : dateNames;
  }
}
