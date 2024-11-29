import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentageOf',
  pure: true,
  standalone: true,
})
export class PercentageOfPipe implements PipeTransform {
  transform(value: number, total: number): string {
    if (!value || total === 0) {
      return 0 + '%';
    }
    const result = Math.round((value / total) * 100);
    if (result === 100 && value < total) {
      return '99%';
    } else if (result >= 1) {
      return result + '%';
    } else {
      return '<1%';
    }
  }
}
