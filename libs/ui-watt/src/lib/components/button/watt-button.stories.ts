/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { StorybookButtonOverviewModule } from './+storybook/storybook-button-overview.module';
import { WattIconButtonComponent } from './icon-button/watt-icon-button.component';
import { WattButtonComponent } from './watt-button.component';
import { WattButtonModule } from './watt-button.module';

export default {
  title: 'Components/Button',
  component: WattButtonComponent,
  subcomponents: { WattIconButtonComponent },
  decorators: [
    moduleMetadata({
      imports: [WattButtonModule],
    }),
  ],
} as Meta<WattButtonComponent>;

const howToUseGuide = `
1. Import ${WattButtonModule.name} in a module
import { ${WattButtonModule.name} } from '@energinet-datahub/watt';

2a. Use <watt-button>Button</watt-button>

OR

2b. Use <watt-icon-button icon="<icon-name>" label="Something meaningful"></watt-icon-button> in the component's HTML template
`;

export const Overview = () => ({
  template: '<storybook-button-overview></storybook-button-overview>',
});
Overview.decorators = [
  moduleMetadata({
    imports: [StorybookButtonOverviewModule],
  }),
];
Overview.parameters = {
  docs: {
    source: {
      code: howToUseGuide,
    },
  },
};

//👇 We create a “template” of how args map to rendering
const ButtonStory: Story<WattButtonComponent> = (args) => ({
  props: args,
  template: `<watt-button>Button</watt-button>`,
});

export const Button = ButtonStory.bind({});
Button.args = {
  type: 'text',
};

const iconButtonTemplate = (args: Partial<WattIconButtonComponent>) =>
  `<watt-icon-button icon="${args.icon}" [disabled]="${args.disabled}" label="Something meaningful"></watt-icon-button>`;

const IconButton: Story<WattIconButtonComponent> = (args) => ({
  props: args,
  template: iconButtonTemplate(args),
});

export const IconButtonStory = IconButton.bind({});

IconButtonStory.storyName = 'Icon Button';
IconButtonStory.argTypes = {
  type: {
    control: false,
  },
  size: {
    control: false,
  },
  loading: {
    control: false,
  },
};
IconButtonStory.args = {
  icon: 'search',
  disabled: false,
};
IconButtonStory.parameters = {
  docs: {
    source: {
      code: iconButtonTemplate(IconButtonStory.args),
    },
  },
};
