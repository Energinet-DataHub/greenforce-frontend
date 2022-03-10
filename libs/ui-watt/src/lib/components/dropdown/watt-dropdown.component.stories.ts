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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { WattDropdownComponent } from './watt-dropdown.component';
import { WattDropdownModule } from './watt-dropdown.module';

export default {
  title: 'Components/Dropdown',
  component: WattDropdownComponent,
  decorators: [
    moduleMetadata({
      imports: [NoopAnimationsModule, WattDropdownModule],
    }),
  ],
} as Meta<WattDropdownComponent>;

//👇 We create a “template” of how args map to rendering
const Template: Story<WattDropdownComponent> = (args) => ({
  props: args,
});

//👇 Each story then reuses that template
export const Dropdown = Template.bind({});

Dropdown.args = {
  placeholder: 'Pick a number',
  multiple: false,
  options: [
    { value: '1', displayValue: '1' },
    { value: '2', displayValue: '2' },
    { value: '3', displayValue: '3' },
  ],
};
