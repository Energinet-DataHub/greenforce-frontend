//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { WattSegmentedButtonsComponent } from './watt-segmented-buttons.component';
import { WattButtonComponent } from '@energinet/watt/button';

const meta: Meta<WattSegmentedButtonsComponent> = {
  title: 'Components/Segmented buttons',
  component: WattSegmentedButtonsComponent,
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, WattSegmentedButtonsComponent, WattButtonComponent],
    }),
  ],
};
export default meta;

export const SegmentedButtons: StoryFn<WattSegmentedButtonsComponent> = () => ({
  template: `
    <h1>Ordinary Segmented Buttons</h1>
    <watt-segmented-buttons [buttons]="[
  { value: 'day', label: 'Day' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
  { value: 'all years', label: 'All years' },
]"></watt-segmented-buttons>
  `,
});

export const WithFormControl: StoryFn<WattSegmentedButtonsComponent> = () => ({
  props: {
    exampleFormControl: new FormControl('all years'),
  },
  template: `
    <h1>Form Control Segmented Buttons</h1>
    <watt-segmented-buttons [formControl]="exampleFormControl" [buttons]="[
  { value: 'day', label: 'Day' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
  { value: 'all years', label: 'All years' },
]"></watt-segmented-buttons>
<h5>Form value: {{exampleFormControl.value}}</h5>
  `,
});

export const Disabled: StoryFn<WattSegmentedButtonsComponent> = () => ({
  props: {
    exampleFormControl: new FormControl('day'),
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <h1>Disable functionality</h1>
      <watt-segmented-buttons [formControl]="exampleFormControl" [buttons]="[
        { value: 'day', label: 'Day' },
        { value: 'month', label: 'Month' },
        { value: 'year', label: 'Year' },
        { value: 'all years', label: 'All years' },
      ]"></watt-segmented-buttons>
      <div style="display: flex; flex-direction: row; gap: 1rem;">
        <watt-button (click)="exampleFormControl.disable()">Disable</watt-button>
        <watt-button (click)="exampleFormControl.enable()">Enable</watt-button>
      </div>
    </div>
  `,
});
