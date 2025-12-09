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

import { WattRadioComponent } from './watt-radio.component';
import { WattButtonComponent } from '../button';

const meta: Meta<WattRadioComponent<string>> = {
  title: 'Components/Radio Button',
  component: WattRadioComponent,
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, WattRadioComponent, WattButtonComponent],
    }),
  ],
};

export default meta;

const template = `<div style="display: flex; gap: var(--watt-space-m); flex-direction: column; margin-bottom: var(--watt-space-m);">
  <watt-radio [group]="group" [formControl]="exampleFormControl" value="angular">Angular</watt-radio>
  <watt-radio [group]="group" [formControl]="exampleFormControl" value="react">React</watt-radio>
  <watt-radio [group]="group" [formControl]="exampleFormControl" value="svelte">Svelte</watt-radio>
</div><p>Value: {{exampleFormControl.value}}</p>`;

const howToUseGuideBasic = `
How to use

1. Import ${WattRadioComponent.name} in a module or component

import { ${WattRadioComponent.name} } from '@energinet/watt/radio';

2. Create FormControl in a component

exampleFormControl = new FormControl(true);

3. Assign the FormControl to the radio component

${template}`;

// "Docs" page will render the first story twice, which will cause issues when
// they have the same group. This fix prevents that by generating a unique ID.
const generateUniqueId = () => crypto.randomUUID?.() ?? Math.random().toString(36).substring(2);

export const WithFormControl: StoryFn<WattRadioComponent<string>> = () => ({
  props: {
    group: `fav_framework_${generateUniqueId()}`,
    exampleFormControl: new FormControl('angular'),
  },
  template,
});
WithFormControl.parameters = {
  docs: {
    source: {
      code: howToUseGuideBasic,
    },
  },
};

export const Disabled: StoryFn<WattRadioComponent<string>> = () => ({
  props: {
    group: `fav_framework_${generateUniqueId()}`,
    exampleFormControl: new FormControl({ value: 'angular', disabled: true }),
  },
  template,
});
Disabled.parameters = {
  docs: {
    source: {
      code: `new FormControl({ value: 'angular', disabled: true })`,
    },
  },
};
