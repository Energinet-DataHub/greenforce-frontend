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
import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { StorybookButtonOverviewComponent } from './+storybook/storybook-button-overview.component';
import { WattButtonComponent } from './watt-button.component';

const meta: Meta<WattButtonComponent> = {
  title: 'Components/Button',
  component: WattButtonComponent,
};

export default meta;

const howToUseGuide = `
1. Import ${WattButtonComponent.name} in a module
import { ${WattButtonComponent.name} } from '@energinet-datahub/watt/button';

2. Use <watt-button>Button</watt-button>
`;

export const Overview = () => ({
  template: '<storybook-button-overview></storybook-button-overview>',
});
Overview.decorators = [
  moduleMetadata({
    imports: [StorybookButtonOverviewComponent],
  }),
];
Overview.parameters = {
  docs: { source: { code: howToUseGuide } },
};

//👇 We create a “template” of how args map to rendering
const ButtonStory: StoryFn<WattButtonComponent> = (args) => ({
  props: args,
  template: `<watt-button>Button</watt-button>`,
});

export const Button = ButtonStory.bind({});
Button.args = {
  variant: 'primary',
};
