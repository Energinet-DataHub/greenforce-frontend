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
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';

import { WattTabsComponent, WattTabComponent, WattTabsActionComponent } from './../index';
import { WattButtonComponent } from '../../button/watt-button.component';

const meta: Meta<WattTabsComponent> = {
  title: 'Components/Tabs',
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      imports: [WattTabComponent, WattTabsActionComponent, WattButtonComponent],
    }),
  ],
  component: WattTabsComponent,
};

export default meta;

const template = `<watt-tabs>
  <watt-tab label="First">Some awesome content for the first tab</watt-tab>
  <watt-tab label="Second">Some awesome content for the second tab</watt-tab>
  <watt-tab label="Third">Some awesome content for the third tab</watt-tab>

  <watt-tabs-action>
    <watt-button variant="secondary">Tab action</watt-button>
  </watt-tabs-action>
</watt-tabs>

<watt-tabs variant="secondary">
  <watt-tab label="First">Some awesome content for the first tab</watt-tab>
  <watt-tab label="Second">Some awesome content for the second tab</watt-tab>
  <watt-tab label="Third">Some awesome content for the third tab</watt-tab>

  <watt-tabs-action>
    <watt-button variant="secondary">Tab action</watt-button>
  </watt-tabs-action>
</watt-tabs>`;

export const Tabs: StoryFn<WattTabsComponent> = (args) => ({
  props: args,
  template,
});

Tabs.parameters = {
  docs: {
    source: {
      code: template,
    },
  },
};
