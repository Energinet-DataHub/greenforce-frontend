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
import { WattSegmentedButtonsComponent } from '../watt-segmented-buttons.component';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattSegmentedButtonComponent } from '../watt-segmented-button.component';

const meta: Meta<WattSegmentedButtonsComponent> = {
  title: 'Components/Segmented buttons',
  component: WattSegmentedButtonsComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        WattSegmentedButtonsComponent,
        WattSegmentedButtonComponent,
        WattButtonComponent,
      ],
    }),
  ],
};
export default meta;

export const SegmentedButtons: StoryFn<WattSegmentedButtonsComponent> = () => ({
  template: `
    <h1>Ordinary Segmented Buttons</h1>
    <watt-segmented-buttons>
      <watt-segmented-button [value]="'day'">Day</watt-segmented-button>
      <watt-segmented-button [value]="'month'">Month</watt-segmented-button>
      <watt-segmented-button [value]="'year'">Year</watt-segmented-button>
    </watt-segmented-buttons>
  `,
});

export const SegmentedButtonsWithFormControl: StoryFn<WattSegmentedButtonsComponent> = () => ({
  props: {
    exampleFormControl: new FormControl('year'),
  },
  template: `
    <h1>Ordinary Segmented Buttons</h1>
    <watt-segmented-buttons [formControl]="exampleFormControl">
      <watt-segmented-button [value]="'day'">Day</watt-segmented-button>
      <watt-segmented-button [value]="'month'">Month</watt-segmented-button>
      <watt-segmented-button [value]="'year'">Year</watt-segmented-button>
    </watt-segmented-buttons>
    <h5>Form value: {{exampleFormControl.value}}</h5>
  `,
});
