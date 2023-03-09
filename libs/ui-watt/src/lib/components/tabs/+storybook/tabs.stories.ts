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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { WattTabsComponent, WattTabComponent } from './../index';

export default {
  title: 'Components/Tabs',
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, WattTabComponent],
    }),
  ],
  component: WattTabsComponent,
} as Meta<WattTabsComponent>;

const template = `<watt-tabs>
  <watt-tab label="First">Some awesome content for the first tab</watt-tab>
  <watt-tab label="Second">Some awesome content for the second tab</watt-tab>
  <watt-tab label="Third">Some awesome content for the third tab</watt-tab>
</watt-tabs>`;

export const tabs: Story<WattTabsComponent> = (args) => ({
  props: args,
  template,
});

tabs.parameters = {
  docs: {
    source: {
      code: template,
    },
  },
};
