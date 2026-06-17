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
import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter, RouterModule } from '@angular/router';
import { Component } from '@angular/core';

import { WattLinkTabsComponent, WattLinkTabComponent } from './../index';

let index = 1;

function generateComponent(template: string) {
  @Component({
    selector: `watt-storybook-${index++}`,
    template,
  })
  class StorybookPageComponent {}

  return StorybookPageComponent;
}

const meta: Meta<WattLinkTabsComponent> = {
  title: 'Components/Tabs',
  decorators: [
    applicationConfig({
      providers: [
        provideLocationMocks(),
        provideRouter([
          { path: '', redirectTo: 'menu-2', pathMatch: 'full' },
          { path: 'menu-1', component: generateComponent('Page 1') },
          { path: 'menu-2', component: generateComponent('Page 2') },
          { path: 'menu-3', component: generateComponent('Page 3') },
        ]),
      ],
    }),
    moduleMetadata({
      imports: [RouterModule, WattLinkTabsComponent, WattLinkTabComponent],
    }),
  ],
  component: WattLinkTabsComponent,
};

export default meta;

const template = `<watt-link-tabs>
  <watt-link-tab label="First" link="/menu-1" />
  <watt-link-tab label="Second" link="/menu-2" />
  <watt-link-tab label="Third" link="/menu-3" />
</watt-link-tabs>`;

export const LinkTabs: StoryFn<WattLinkTabsComponent> = (args) => ({
  props: args,
  template,
});

LinkTabs.parameters = {
  docs: {
    source: {
      code: template,
    },
  },
};
