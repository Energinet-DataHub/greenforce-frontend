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

import { ReactiveFormsModule } from '@angular/forms';
import {
  WattSegmentedButton,
  WattSegmentedButtonsComponent,
} from './watt-segmented-buttons.component';

const meta: Meta<WattSegmentedButtonsComponent> = {
  title: 'Components/Segmented buttons',
  component: WattSegmentedButtonsComponent,
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, WattSegmentedButtonsComponent],
    }),
  ],
};

const segmentedButtons: WattSegmentedButton[] = [
  { value: 'day', label: 'Day' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
  { value: 'all years', label: 'All years' },
];

export default meta;

export const SegmentedButtonsStory: StoryFn<WattSegmentedButtonsComponent> = (args) => ({
  props: args,
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
