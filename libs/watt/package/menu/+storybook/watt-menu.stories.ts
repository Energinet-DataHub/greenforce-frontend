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
import { Component, importProvidersFrom } from '@angular/core';
import { Meta, moduleMetadata, StoryObj, applicationConfig } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { WattButtonComponent } from '../../button';
import { WattIconComponent } from '../../icon';
import { WattMenuComponent } from '../watt-menu.component';
import { WattMenuItemComponent } from '../watt-menu-item.component';
import { WattMenuGroupComponent } from '../watt-menu-group.component';
import { WattMenuTriggerDirective } from '../watt-menu-trigger.directive';
import {
  menuWithIconsTemplate,
  menuNoIconsTemplate,
  menuMixedIconsTemplate,
  menuGroupedWithIconsTemplate,
  menuGroupedNoIconsTemplate,
  menuGroupedMixedIconsTemplate,
} from './watt-menu-story-templates';


@Component({
  selector: 'watt-menu-story',
  standalone: true,
  template: `
    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
      <div>
        <h3>All items with icons</h3>
        ${menuWithIconsTemplate}
      </div>

      <div>
        <h3>No icons</h3>
        ${menuNoIconsTemplate}
      </div>

      <div>
        <h3>Mixed (some with icons)</h3>
        ${menuMixedIconsTemplate}
      </div>
    </div>

    <p style="margin-top: 20px">Last action: {{ lastAction || 'None' }}</p>
  `,
  imports: [
    WattButtonComponent,
    WattIconComponent,
    WattMenuComponent,
    WattMenuItemComponent,
    WattMenuTriggerDirective,
  ],
})
class MenuBasicStoryComponent {
  lastAction: string | null = null;

  onAction(action: string) {
    this.lastAction = action;
  }
}

@Component({
  selector: 'watt-menu-groups-story',
  standalone: true,
  template: `
    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
      <div>
        <h3>Grouped with icons</h3>
        ${menuGroupedWithIconsTemplate}
      </div>

      <div>
        <h3>Grouped without icons</h3>
        ${menuGroupedNoIconsTemplate}
      </div>

      <div>
        <h3>Grouped mixed icons</h3>
        ${menuGroupedMixedIconsTemplate}
      </div>
    </div>

    <p style="margin-top: 20px">Last action: {{ lastAction || 'None' }}</p>
  `,
  imports: [
    WattButtonComponent,
    WattIconComponent,
    WattMenuComponent,
    WattMenuItemComponent,
    WattMenuGroupComponent,
    WattMenuTriggerDirective,
  ],
})
class MenuGroupsStoryComponent {
  lastAction: string | null = null;

  onAction(action: string) {
    this.lastAction = action;
  }
}

const meta: Meta<WattMenuComponent> = {
  title: 'Components/Menu',
  component: WattMenuComponent,
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(BrowserAnimationsModule)],
    }),
    moduleMetadata({
      imports: [
        WattMenuComponent,
        WattMenuItemComponent,
        WattMenuGroupComponent,
        MenuBasicStoryComponent,
        MenuGroupsStoryComponent,
        WattMenuTriggerDirective,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<WattMenuComponent>;

export const Basic: Story = {
  render: () => ({
    props: {},
    template: `<watt-menu-story />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<!-- All items with icons -->
${menuWithIconsTemplate}

<!-- No icons -->
${menuNoIconsTemplate}

<!-- Mixed (some with icons) -->
${menuMixedIconsTemplate}`,
      },
    },
  },
};

export const WithGroups: Story = {
  render: () => ({
    props: {},
    template: `<watt-menu-groups-story />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<!-- Grouped with all icons -->
${menuGroupedWithIconsTemplate}

<!-- Grouped without icons -->
${menuGroupedNoIconsTemplate}

<!-- Grouped with mixed icons -->
${menuGroupedMixedIconsTemplate}`,
      },
    },
  },
};
