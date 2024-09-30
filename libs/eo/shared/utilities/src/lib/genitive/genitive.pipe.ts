import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'genitive',
  standalone: true,
})
export class EoGenitivePipe implements PipeTransform {

  transform(value: string, language: string): string {
    if (!value) {
      return '';
    }

    const lastChar = value.charAt(value.length - 1);

    if (language === 'da') {
      // Danish rules
      if (lastChar === 's') {
        return `${value}'`; // Just add an apostrophe if it ends with 's'
      } else {
        return `${value}s`; // Add 's' otherwise
      }
    } else if (language === 'en') {
      // English rules
      if (lastChar === 's') {
        return `${value}'`; // Just add an apostrophe if it ends with 's'
      } else {
        console.log(value);
        return `${value}'s`; // Add 's otherwise'
      }
    }

    return value; // Fallback if language is not recognized
  }

}
