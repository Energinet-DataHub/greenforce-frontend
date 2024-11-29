import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { WattTextFieldComponent } from '../watt-text-field.component';
import { WattFieldHintComponent } from '../../field/watt-field-hint.component';

export const wattAutoCompleteTemplate = `
<watt-text-field
  [autocompleteOptions]="filteredOptions"
  (search)="search($event)"
  prefix="search"
  [formControl]="exampleFormControl"
  label="WattTextField with autocomplete"
  type="text">
  <watt-field-hint>Enter new CVR number or choose from previous transfer agreements</watt-field-hint>
</watt-text-field>
<p>Value: {{exampleFormControl.value}}</p>`;

@Component({
  selector: 'watt-storybook-autocomplete',
  standalone: true,
  imports: [WattTextFieldComponent, WattFieldHintComponent],
  template: wattAutoCompleteTemplate,
})
export class StorybookAutocompleteComponent {
  protected options = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
  ];
  protected filteredOptions = this.options;
  protected exampleFormControl = new FormControl(null);

  protected search(value: string): void {
    this.filteredOptions = this.options.filter((option) => option.includes(value));
  }
}
