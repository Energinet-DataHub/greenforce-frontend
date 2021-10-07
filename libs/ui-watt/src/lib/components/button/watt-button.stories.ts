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

import { WattPrimaryButtonComponent } from './primary-button/watt-primary-button.component';
import { WattSecondaryButtonComponent } from './secondary-button/watt-secondary-button.component';
import { WattTextButtonComponent } from './text-button/watt-text-button.component';
import { StorybookButtonOverviewModule } from './storybook/storybook-button-overview.module';
import { WattButtonComponent } from './watt-button.component';
import { WattButtonModule } from './watt-button.module';

export default {
  title: 'Components/Button',
  component: WattButtonComponent,
  decorators: [
    moduleMetadata({
      // NOTE(xdzus): Needed because Storybook doesn't support Ivy
      // see https://github.com/storybookjs/storybook/issues/10863#issuecomment-632571554
      // see https://github.com/nrwl/nx/issues/2601
      // see https://github.com/nrwl/nx/pull/4641
      entryComponents: [
        WattTextButtonComponent,
        WattPrimaryButtonComponent,
        WattSecondaryButtonComponent,
      ],
      imports: [WattButtonModule],
    }),
  ],
} as Meta<WattButtonComponent>;

export const Overview = () => ({
  template: '<storybook-button-overview></storybook-button-overview>',
});
const emptySourceCodeBlock = ' ';
Overview.decorators = [
  moduleMetadata({
    imports: [StorybookButtonOverviewModule],
  }),
];
Overview.parameters = {
  docs: {
    source: {
      code: emptySourceCodeBlock,
    },
  },
};

//👇 We create a “template” of how args map to rendering
const ButtonTemplate: Story<WattButtonComponent> = (args) => ({
  props: args,
  template: `
<watt-button type="${args.type}" icon="${args.icon}" [disabled]="${args.disabled}" size="${args.size}">
  Button
</watt-button>`,
});

export const PrimaryButton = ButtonTemplate.bind({});
PrimaryButton.storyName = 'Primary';
PrimaryButton.args = {
  type: 'primary',
};

export const PrimaryButtonWithIcon = ButtonTemplate.bind({});
PrimaryButtonWithIcon.storyName = 'Primary with icon';
PrimaryButtonWithIcon.args = {
  icon: 'add',
  type: 'primary',
};

export const SecondaryButton = ButtonTemplate.bind({});
SecondaryButton.storyName = 'Secondary';
SecondaryButton.args = {
  type: 'secondary',
};

export const SecondaryButtonWithIcon = ButtonTemplate.bind({});
SecondaryButtonWithIcon.storyName = 'Secondary with icon';
SecondaryButtonWithIcon.args = {
  icon: 'add',
  type: 'secondary',
};

export const TextButton = ButtonTemplate.bind({});
TextButton.storyName = 'Text';
TextButton.args = {
  type: 'text',
};

export const TextButtonWithIcon = ButtonTemplate.bind({});
TextButtonWithIcon.storyName = 'Text with icon';
TextButtonWithIcon.args = {
  icon: 'add',
  type: 'text',
};

export const ButtonSizeNormal = ButtonTemplate.bind({});
ButtonSizeNormal.storyName = 'Normal size';
ButtonSizeNormal.args = {
  type: 'primary',
};

export const ButtonSizeLarge = ButtonTemplate.bind({});
ButtonSizeLarge.storyName = 'Large size';
ButtonSizeLarge.args = {
  type: 'primary',
  size: 'large',
};
