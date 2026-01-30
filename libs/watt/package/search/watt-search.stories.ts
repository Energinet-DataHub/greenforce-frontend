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
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { WattSearchComponent } from './watt-search.component';
import { WattSimpleSearchComponent } from './watt-simple-search.component';

const meta: Meta<WattSearchComponent> = {
  title: 'Components/Search',
  component: WattSearchComponent,
  decorators: [
    moduleMetadata({
      imports: [WattSimpleSearchComponent],
    }),
  ],
};

export default meta;

export const Overview: StoryObj<WattSearchComponent> = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <watt-search label="Search" />
        <watt-simple-search label="Search" />
      </div>
    `,
  }),
};
