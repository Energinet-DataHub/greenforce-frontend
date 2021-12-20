import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { emDash } from '../identity/em-dash';

@Pipe({ name: 'emptyValue' })
export class EmptyValuePipe implements PipeTransform {
  transform(
    value: string | undefined | null,
    translation?: string,
    customFallbackValue?: string
  ): string {
    if (value === undefined || value === null || value.trim() === '') {
      return customFallbackValue ? customFallbackValue : emDash;
    } else {
      return translation ? translation : value;
    }
  }
}

@NgModule({
  declarations: [EmptyValuePipe],
  imports: [],
  exports: [EmptyValuePipe],
})
export class DhEmptyValuePipeScam {}
