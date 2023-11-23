import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentageOf',
  pure: true,
  standalone: true,
})
export class PercentageOfPipe implements PipeTransform {
  transform(value: number, total: number): string {
    if (total === 0) {
      return 0 + '%';
    }
    return Math.round((value / total) * 100) + '%';
  }
}
