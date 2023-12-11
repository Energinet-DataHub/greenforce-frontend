import { Component } from '@angular/core';

import { WattTextFieldComponent } from '../watt-text-field.component';
import { FormControl } from '@angular/forms';

export const wattAutoCompleteTemplate = `
<watt-text-field
  [autocompleteOptions]="filteredOptions"
  (search)="search($event)"
  [formControl]="exampleFormControl"
  label="WattTextField with autocomplete"
  type="text"
/>`;

@Component({
  selector: 'watt-storybook-autocomplete',
  standalone: true,
  imports: [WattTextFieldComponent],
  template: wattAutoCompleteTemplate,
})
export class StorybookAutocompleteComponent {
  protected options = ['one', 'two', 'three'];
  protected filteredOptions!: string[];

  protected exampleFormControl = new FormControl(null);

  protected search(value: string): void {
    this.filteredOptions = this.options.filter((option) => option.includes(value));
  }
}
