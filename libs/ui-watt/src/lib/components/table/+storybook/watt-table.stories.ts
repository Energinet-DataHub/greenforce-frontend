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

import { StorybookTableOverviewComponent } from './storybook-table-overview.component';
import { StorybookTableOverviewModule } from './storybook-table-overview.module';

export default {
  title: 'Components/Table',
  decorators: [
    moduleMetadata({
      imports: [StorybookTableOverviewModule],
    }),
  ],
};

export const Overview: Story<StorybookTableOverviewComponent> = (args) => ({
  props: args,
  template: `
    <storybook-table-overview
      [selectable]="selectable"
      [suppressRowHoverHighlight]="suppressRowHoverHighlight"
    ></storybook-table-overview>
  `,
});

Overview.args = { selectable: true, suppressRowHoverHighlight: false };
Overview.parameters = {
  docs: {
    source: {
      code: '<watt-table [dataSource]="dataSource" [columns]="columns"></watt-table>',
    },
  },
};
