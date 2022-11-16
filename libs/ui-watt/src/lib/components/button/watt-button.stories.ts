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
import { moduleMetadata, Story } from '@storybook/angular';
import { WattStorybookButtonComponent } from './+storybook/storybook-button.component';
import { WattButtonComponent } from './watt-button.component';
import { WattButtonModule } from './watt-button.module';

// export default {
//   title: 'Components/Button',
//   component: WattButtonComponent,
//   decorators: [
//     moduleMetadata({
//       imports: [WattButtonModule],
//     }),
//   ],
// } as Meta<WattButtonComponent>;

// const howToUseGuide = `
// 1. Import ${WattButtonModule.name} in a module
// import { ${WattButtonModule.name} } from '@energinet-datahub/watt/button';

// 2. Use <watt-button>Button</watt-button>
// `;

const Story: Story<WattStorybookButtonComponent> = (args) => ({
  props: args,
  template: `
    <watt-storybook-button [variant]="variant"></watt-storybook-button>
  `,
});

Story.decorators = [
  moduleMetadata({
    imports: [WattStorybookButtonComponent],
  }),
];

export const Primary = Story.bind({});
Primary.args = { variant: 'primary' };

export const Secondary = Story.bind({});
Secondary.args = { variant: 'secondary' };

export const Text = Story.bind({});
Text.args = { variant: 'text' };

export const Large: Story<WattButtonComponent> = () => ({
  template: `<watt-button size="large">Enabled</watt-button>`,
});

Large.decorators = [
  moduleMetadata({
    imports: [WattButtonModule],
  }),
];
