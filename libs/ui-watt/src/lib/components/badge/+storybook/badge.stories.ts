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
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { WattBadgeComponent, WattBadgeModule } from './../index';

export default {
  title: 'Components/Badge',
  decorators: [
    moduleMetadata({
      imports: [WattBadgeModule],
    }),
  ],
  component: WattBadgeComponent,
} as Meta<WattBadgeComponent>;

export const overview: Story<WattBadgeComponent> = (args) => ({
  props: args,
  template: `
  <watt-badge>Default</watt-badge>
  <br />
  <watt-badge type="warning">Warning</watt-badge>
  <br />
  <watt-badge type="danger">Danger</watt-badge>
  <br />
  <watt-badge type="success">Success</watt-badge>
  <br />
  <watt-badge type="info">Info</watt-badge>
  `,
});
overview.parameters = {
  docs: {
    source: {
      code: 'Nothing to see here.',
    },
  },
};
overview.argTypes = {
  type: {
    control: false,
  },
};

const template: Story<WattBadgeComponent> = (args) => ({
  props: args,
  template: `<watt-badge type="${args.type}">${args.type}</watt-badge>`,
});

export const warning = template.bind({});
warning.args = {
  type: 'warning',
};

export const danger = template.bind({});
danger.args = {
  type: 'danger',
};

export const success = template.bind({});
success.args = {
  type: 'success',
};

export const info = template.bind({});
info.args = {
  type: 'info',
};
