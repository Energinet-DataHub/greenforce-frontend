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
import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';

import { WattCheckboxComponent } from '../watt-checkbox.component';
import { WattCheckboxStatesModule } from './storybook-checkbox-states.module';
import { WattCardComponent } from '../../card';

const meta: Meta<WattCheckboxComponent> = {
  title: 'Components/Checkbox',
  component: WattCheckboxComponent,
  decorators: [
    moduleMetadata({
      imports: [WattCheckboxComponent, WattCheckboxStatesModule, WattCardComponent],
    }),
  ],
};

export default meta;

const statesTemplate: StoryFn = () => ({
  template: `
  <watt-card>
    <storybook-checkbox-states></storybook-checkbox-states>
  </watt-card>`,
});

export const States = statesTemplate.bind({});
States.parameters = {
  docs: { disable: true },
  pseudo: {
    hover: ['.hover'],
  },
};
