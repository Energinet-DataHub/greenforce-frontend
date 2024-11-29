import { Pipe, PipeTransform } from '@angular/core';

import { emDash } from './em-dash';

type TValue = string | number | undefined | null;

@Pipe({
  name: 'dhEmDashFallback',
  standalone: true,
})
export class DhEmDashFallbackPipe implements PipeTransform {
  transform(value: TValue): string | number {
    if (this.isFalsy(value)) {
      return emDash;
    }

    return value as string | number;
  }

  private isFalsy(value: TValue): boolean {
    if (typeof value === 'string') {
      return value.trim() === '';
    }

    return value == null;
  }
}
