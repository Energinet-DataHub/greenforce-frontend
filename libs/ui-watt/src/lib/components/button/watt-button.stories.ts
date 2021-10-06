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
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';
import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { WattLinkButtonComponent } from './link-button/watt-link-button.component';
import { WattPrimaryButtonComponent } from './primary-button/watt-primary-button.component';
import { WattPrimaryLinkButtonComponent } from './primary-link-button/watt-primary-link-button.component';
import { WattSecondaryButtonComponent } from './secondary-button/watt-secondary-button.component';
import { WattSecondaryLinkButtonComponent } from './secondary-link-button/watt-secondary-link-button.component';
import { WattTextButtonComponent } from './text-button/watt-text-button.component';
import { ButtonOverviewModule } from './storybook/button-overview.module';
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
        WattLinkButtonComponent,
        WattPrimaryButtonComponent,
        WattPrimaryLinkButtonComponent,
        WattSecondaryButtonComponent,
        WattSecondaryLinkButtonComponent,
      ],
      imports: [WattButtonModule],
    }),
  ],
} as Meta<WattButtonComponent>;

export const Overview = () => ({
  template: '<watt-button-overview></watt-button-overview>',
});
const emptySourceCodeBlock = ' ';
Overview.decorators = [
  moduleMetadata({
    imports: [ButtonOverviewModule],
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
<watt-button type="${args.type}" icon="${args.icon}" [disabled]="${args.disabled}">
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

const linkButtonTemplate = (args: WattButtonComponent) => {
  return `
<watt-button routerLink="storybook" type="${args.type}" icon="${args.icon}" [disabled]="${args.disabled}">
  Button
</watt-button>`;
};

export const PrimaryLinkButton = (args: WattButtonComponent) => ({
  props: args,
  template: linkButtonTemplate(args),
});
PrimaryLinkButton.storyName = 'Primary link';
PrimaryLinkButton.decorators = [
  moduleMetadata({
    imports: [RouterModule, RouterTestingModule.withRoutes([])],
  }),
];
PrimaryLinkButton.args = {
  disabled: false,
  icon: '',
  type: 'primary',
};
PrimaryLinkButton.parameters = {
  docs: {
    source: {
      code: linkButtonTemplate(PrimaryLinkButton.args as WattButtonComponent),
    },
  },
};

export const PrimaryLinkWithIconButton = (args: WattButtonComponent) => ({
  props: args,
  template: linkButtonTemplate(args),
});
PrimaryLinkWithIconButton.storyName = 'Primary link with icon';
PrimaryLinkWithIconButton.decorators = [
  moduleMetadata({
    imports: [RouterModule, RouterTestingModule.withRoutes([])],
  }),
];
PrimaryLinkWithIconButton.args = {
  disabled: false,
  icon: 'add',
  type: 'primary',
};
PrimaryLinkWithIconButton.parameters = {
  docs: {
    source: {
      code: linkButtonTemplate(
        PrimaryLinkWithIconButton.args as WattButtonComponent
      ),
    },
  },
};

export const SecondaryLinkButton = (args: WattButtonComponent) => ({
  props: args,
  template: linkButtonTemplate(args),
});
SecondaryLinkButton.storyName = 'Secondary link';
SecondaryLinkButton.decorators = [
  moduleMetadata({
    imports: [RouterModule, RouterTestingModule.withRoutes([])],
  }),
];
SecondaryLinkButton.args = {
  disabled: false,
  icon: '',
  type: 'secondary',
};
SecondaryLinkButton.parameters = {
  docs: {
    source: {
      code: linkButtonTemplate(SecondaryLinkButton.args as WattButtonComponent),
    },
  },
};

export const SecondaryLinkWithIconButton = (args: WattButtonComponent) => ({
  props: args,
  template: linkButtonTemplate(args),
});
SecondaryLinkWithIconButton.storyName = 'Secondary link with icon';
SecondaryLinkWithIconButton.decorators = [
  moduleMetadata({
    imports: [RouterModule, RouterTestingModule.withRoutes([])],
  }),
];
SecondaryLinkWithIconButton.args = {
  disabled: false,
  icon: 'add',
  type: 'secondary',
};
SecondaryLinkWithIconButton.parameters = {
  docs: {
    source: {
      code: linkButtonTemplate(
        SecondaryLinkWithIconButton.args as WattButtonComponent
      ),
    },
  },
};

export const TextLinkButton = (args: WattButtonComponent) => ({
  props: args,
  template: linkButtonTemplate(args),
});
TextLinkButton.storyName = 'Text link';
TextLinkButton.decorators = [
  moduleMetadata({
    imports: [RouterModule, RouterTestingModule.withRoutes([])],
  }),
];
TextLinkButton.args = {
  disabled: false,
  icon: '',
  type: 'text',
};
TextLinkButton.parameters = {
  docs: {
    source: {
      code: linkButtonTemplate(TextLinkButton.args as WattButtonComponent),
    },
  },
};

export const TextLinkButtonWithIcon = (args: WattButtonComponent) => ({
  props: args,
  template: linkButtonTemplate(args),
});
TextLinkButtonWithIcon.storyName = 'Text link with icon';
TextLinkButtonWithIcon.decorators = [
  moduleMetadata({
    imports: [RouterModule, RouterTestingModule.withRoutes([])],
  }),
];
TextLinkButtonWithIcon.args = {
  disabled: false,
  icon: 'add',
  type: 'text',
};
TextLinkButtonWithIcon.parameters = {
  docs: {
    source: {
      code: linkButtonTemplate(
        TextLinkButtonWithIcon.args as WattButtonComponent
      ),
    },
  },
};
