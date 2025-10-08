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
import { importProvidersFrom } from '@angular/core';
import { Meta, moduleMetadata, StoryObj, applicationConfig } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { WattMenuComponent } from '../watt-menu.component';
import { WattMenuItemComponent } from '../watt-menu-item.component';
import { WattMenuGroupComponent } from '../watt-menu-group.component';
import { WattMenuTriggerDirective } from '../watt-menu-trigger.directive';
import { WattButtonComponent } from '../../button';
import { WattIconComponent } from '../../icon';
import { MenuBasicStoryComponent } from './menu-basic-story.component';
import { MenuGroupsStoryComponent } from './menu-groups-story.component';
import { MenuAsyncStoryComponent } from './menu-async-story.component';
import {
  menuWithIconsTemplate,
  menuNoIconsTemplate,
  menuMixedIconsTemplate,
  menuGroupedWithIconsTemplate,
  menuGroupedNoIconsTemplate,
  menuGroupedMixedIconsTemplate,
} from './watt-menu-story-templates';

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
        WattButtonComponent,
        WattIconComponent,
        MenuBasicStoryComponent,
        MenuGroupsStoryComponent,
        MenuAsyncStoryComponent,
        WattMenuTriggerDirective,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<WattMenuComponent>;
type AsyncStory = StoryObj<MenuAsyncStoryComponent>;

export const Basic: Story = {
  render: () => ({
    props: {},
    template: `<watt-menu-basic-story />`,
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

export const AsyncItems: AsyncStory = {
  args: {
    showIcons: true,
    loadDelay: 1000,
  },
  argTypes: {
    showIcons: {
      name: 'Show Icons',
      control: { type: 'boolean' },
      description: 'Toggle visibility of menu item icons',
      table: {
        defaultValue: { summary: 'true' },
        category: 'Display',
        type: { summary: 'boolean' },
      },
    },
    loadDelay: {
      name: 'Load Delay (ms)',
      control: { type: 'number', min: 0, max: 5000, step: 100 },
      description: 'Time to wait before menu items are loaded',
      table: {
        defaultValue: { summary: '1000' },
        category: 'Behavior',
        type: { summary: 'number' },
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<watt-menu-async-story [showIcons]="showIcons" [loadDelay]="loadDelay" />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<!-- Component usage -->
@Component({
  // ...
})
export class MyComponent implements OnInit, OnDestroy {
  showIcons = true;
  itemsLoaded = signal(false);
  private loadingTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit() {
    // Simulate async loading
    this.loadingTimeout = setTimeout(() => {
      this.itemsLoaded.set(true);
    }, 1000);
  }

  ngOnDestroy() {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
  }

  onAction(action: string) {
    console.log('Menu action:', action);
  }
}

<!-- Template -->
<watt-button
  variant="secondary"
  [wattMenuTriggerFor]="asyncMenu"
  aria-label="Open async menu"
>
  Async Dynamic Icons
  <watt-icon name="down" size="xs" />
</watt-button>

<watt-menu #asyncMenu>
  @if (itemsLoaded()) {
    <watt-menu-item (click)="onAction('Profile')">
      @if (showIcons) {
        <watt-icon name="user" />
      }
      Profile
    </watt-menu-item>
    <watt-menu-item (click)="onAction('Settings')">
      Settings (no icon)
    </watt-menu-item>
    <watt-menu-item (click)="onAction('Preferences')">
      @if (showIcons) {
        <watt-icon name="settings" />
      }
      Preferences
    </watt-menu-item>
    <watt-menu-item (click)="onAction('Help')">
      Help (no icon)
    </watt-menu-item>
    <watt-menu-item (click)="onAction('Logout')">
      @if (showIcons) {
        <watt-icon name="logout" />
      }
      Logout
    </watt-menu-item>
  }
</watt-menu>`,
      },
    },
    controls: {
      expanded: true,
    },
  },
};
