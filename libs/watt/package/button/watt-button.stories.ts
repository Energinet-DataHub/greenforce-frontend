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
import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { StorybookButtonOverviewComponent } from './+storybook/storybook-button-overview.component';
import { WattButtonComponent } from './watt-button.component';
import { VATER } from '../vater';

const meta: Meta<WattButtonComponent> = {
  title: 'Components/Button',
  component: WattButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [WattButtonComponent, VATER],
    }),
  ],
};

export default meta;

const howToUseGuide = `
1. Import ${WattButtonComponent.name} in a module
import { ${WattButtonComponent.name} } from '@energinet/watt/button';

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

export const IconButtons: StoryFn<WattButtonComponent> = () => ({
  template: `
    <div style="display: grid; gap: var(--watt-space-l);">
      <section>
        <h3>Leading icons</h3>
        <div style="display: flex; flex-wrap: wrap; gap: var(--watt-space-m); align-items: center;">
          <watt-button icon="plus">Create</watt-button>
          <watt-button icon="search">Search</watt-button>
          <watt-button icon="edit">Edit</watt-button>
          <watt-button icon="download">Download</watt-button>
          <watt-button icon="refresh">Refresh</watt-button>
          <watt-button icon="send">Send</watt-button>
        </div>
      </section>

      <section>
        <h3>Trailing icons</h3>
        <div style="display: flex; flex-wrap: wrap; gap: var(--watt-space-m); align-items: center;">
          <watt-button icon="right" iconPosition="trailing">Next</watt-button>
          <watt-button icon="openInNew" iconPosition="trailing">Open</watt-button>
          <watt-button icon="download" iconPosition="trailing">Download</watt-button>
          <watt-button icon="send" iconPosition="trailing">Send</watt-button>
          <watt-button icon="arrowRightAlt" iconPosition="trailing">Continue</watt-button>
        </div>
      </section>

      <section>
        <h3>Secondary buttons</h3>
        <div style="display: flex; flex-wrap: wrap; gap: var(--watt-space-m); align-items: center;">
          <watt-button variant="secondary" icon="plus">Create</watt-button>
          <watt-button variant="secondary" icon="filter">Filter</watt-button>
          <watt-button variant="secondary" icon="settings">Settings</watt-button>
          <watt-button variant="secondary" icon="right" iconPosition="trailing">Next</watt-button>
          <watt-button variant="secondary" icon="openInNew" iconPosition="trailing">Open</watt-button>
        </div>
      </section>

      <section>
        <h3>Icon only</h3>
        <div style="display: flex; flex-wrap: wrap; gap: var(--watt-space-m); align-items: center;">
          <watt-button variant="icon" icon="plus" aria-label="Add" />
          <watt-button variant="secondary-icon" icon="plus" aria-label="Add" />
          <watt-button variant="secondary-icon" icon="search" aria-label="Search" />
          <watt-button variant="secondary-icon" icon="settings" aria-label="Settings" />
        </div>
      </section>
    </div>
  `,
});

export const BlockButtons: StoryFn<WattButtonComponent> = () => ({
  template: `
    <vater-stack direction="column" gap="l" fill="horizontal" align="stretch">
      <section vater fill="horizontal">
        <h3>Regular</h3>
        <vater-stack direction="column" gap="m" fill="horizontal" align="stretch">
          <watt-button block>Primary</watt-button>
          <watt-button block variant="secondary">Secondary</watt-button>
          <watt-button block variant="text">Text</watt-button>
        </vater-stack>
      </section>

      <section vater fill="horizontal">
        <h3>With icons</h3>
        <vater-stack direction="column" gap="m" fill="horizontal" align="stretch">
          <watt-button block icon="plus">Leading icon</watt-button>
          <watt-button block icon="right" iconPosition="trailing">
            Trailing icon
          </watt-button>
          <watt-button block variant="secondary" icon="search">
            Secondary leading icon
          </watt-button>
          <watt-button
            block
            variant="secondary"
            icon="openInNew"
            iconPosition="trailing"
          >
            Secondary trailing icon
          </watt-button>
        </vater-stack>
      </section>

      <section vater fill="horizontal">
        <h3>States</h3>
        <vater-stack direction="column" gap="m" fill="horizontal" align="stretch">
          <watt-button block [loading]="true">Loading</watt-button>
          <watt-button block icon="download" [loading]="true">
            Loading with icon
          </watt-button>
          <watt-button block variant="secondary" [disabled]="true">
            Disabled secondary
          </watt-button>
        </vater-stack>
      </section>

      <section vater fill="horizontal">
        <h3>Icon only</h3>
        <vater-stack direction="column" gap="m" fill="horizontal" align="stretch">
          <watt-button block variant="icon" icon="plus" aria-label="Add" />
          <watt-button
            block
            variant="secondary-icon"
            icon="search"
            aria-label="Search"
          />
        </vater-stack>
      </section>
    </vater-stack>
  `,
});
