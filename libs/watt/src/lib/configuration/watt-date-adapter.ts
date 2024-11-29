import { NativeDateAdapter } from '@angular/material/core';

export type WattSupportedLocales = 'da' | 'en';
const danishLocale = 'da';

export class WattDateAdapter extends NativeDateAdapter {
  setActiveLocale(language: WattSupportedLocales): void {
    this.setLocale(language === danishLocale ? danishLocale : 'en-GB');
  }

  /**
   * This is necessary to remove the dots from the date (ordinals) for danish locale in the calendar view.
   * due to `Intl.DateTimeFormat`
   */
  override getDateNames(): string[] {
    const dateNames = super.getDateNames();

    return this.locale === danishLocale
      ? dateNames.map((dateName) => dateName.replace(/\./g, ''))
      : dateNames;
  }

  /**
   * Our week starts on Monday
   * @returns 0 for Sunday, 1 for Monday, etc.
   */
  override getFirstDayOfWeek(): number {
    return 1;
  }
}
