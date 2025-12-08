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

import { WattRadioGroupComponent, WATT_RADIO } from './watt-radio-group.component';

const meta: Meta<WattRadioGroupComponent<string>> = {
  title: 'Components/Radio Button Group',
  component: WattRadioGroupComponent,
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, WATT_RADIO],
    }),
  ],
};

export default meta;

const template = `
  <watt-radio-group
    label="Best Framework"
    [readonly]="readonly"
    [formControl]="exampleFormControl"
  >
    <watt-radio value="angular">Angular</watt-radio>
    <watt-radio value="react">React</watt-radio>
    <watt-radio value="svelte">Svelte</watt-radio>
  </watt-radio-group>
  <p>Value: {{exampleFormControl.value}}</p>
`;

export const Overview: StoryFn<WattRadioGroupComponent<string>> = () => ({
  props: {
    exampleFormControl: new FormControl('angular'),
    readonly: false,
  },
  template,
});

export const Disabled: StoryFn<WattRadioGroupComponent<string>> = () => ({
  props: {
    exampleFormControl: new FormControl({ value: 'angular', disabled: true }),
    readonly: false,
  },
  template,
});

export const ReadOnly: StoryFn<WattRadioGroupComponent<string>> = () => ({
  props: {
    exampleFormControl: new FormControl('angular'),
    readonly: true,
  },
  template,
});
