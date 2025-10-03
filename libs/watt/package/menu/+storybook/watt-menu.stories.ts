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

// Template strings for code examples
const menuWithIconsTemplate = `<watt-button
  variant="secondary"
  [wattMenuTriggerFor]="menuWithIcons"
  aria-label="Open menu with icons"
>
  With Icons
  <watt-icon name="down" size="xs" />
</watt-button>

<watt-menu #menuWithIcons>
  <watt-menu-item (click)="onAction('New')">
    <watt-icon name="plus" />
    New
  </watt-menu-item>
  <watt-menu-item (click)="onAction('Open')">
    <watt-icon name="inventory" />
    Open
  </watt-menu-item>
  <watt-menu-item (click)="onAction('Save')">
    <watt-icon name="save" />
    Save
  </watt-menu-item>
  <watt-menu-item [disabled]="true" (click)="onAction('Delete')">
    <watt-icon name="remove" />
    Delete (disabled)
  </watt-menu-item>
</watt-menu>`;

const menuNoIconsTemplate = `<watt-button
  variant="secondary"
  [wattMenuTriggerFor]="menuNoIcons"
  aria-label="Open menu without icons"
>
  No Icons
  <watt-icon name="down" size="xs" />
</watt-button>

<watt-menu #menuNoIcons>
  <watt-menu-item (click)="onAction('New')">New</watt-menu-item>
  <watt-menu-item (click)="onAction('Open')">Open</watt-menu-item>
  <watt-menu-item (click)="onAction('Save')">Save</watt-menu-item>
  <watt-menu-item [disabled]="true" (click)="onAction('Delete')">
    Delete (disabled)
  </watt-menu-item>
</watt-menu>`;

const menuMixedIconsTemplate = `<watt-button
  variant="secondary"
  [wattMenuTriggerFor]="menuMixed"
  aria-label="Open menu with mixed icons"
>
  Mixed Icons
  <watt-icon name="down" size="xs" />
</watt-button>

<watt-menu #menuMixed>
  <watt-menu-item (click)="onAction('New')">
    <watt-icon name="plus" />
    New
  </watt-menu-item>
  <watt-menu-item (click)="onAction('Open')">Open</watt-menu-item>
  <watt-menu-item (click)="onAction('Save')">
    <watt-icon name="save" />
    Save
  </watt-menu-item>
  <watt-menu-item [disabled]="true" (click)="onAction('Delete')">
    Delete (disabled)
  </watt-menu-item>
</watt-menu>`;

const menuGroupedWithIconsTemplate = `<watt-button
  variant="secondary"
  [wattMenuTriggerFor]="menuWithIcons"
  aria-label="Open menu with icons"
>
  File
  <watt-icon name="down" size="xs" />
</watt-button>

<watt-menu #menuWithIcons>
  <watt-menu-group label="File">
    <watt-menu-item (click)="onAction('New')">
      <watt-icon name="plus" />
      New
    </watt-menu-item>
    <watt-menu-item (click)="onAction('Open')">
      <watt-icon name="inventory" />
      Open
    </watt-menu-item>
    <watt-menu-item (click)="onAction('Save')">
      <watt-icon name="save" />
      Save
    </watt-menu-item>
  </watt-menu-group>

  <watt-menu-group label="Edit">
    <watt-menu-item (click)="onAction('Cut')">
      <watt-icon name="minus" />
      Cut
    </watt-menu-item>
    <watt-menu-item (click)="onAction('Copy')">
      <watt-icon name="contentCopy" />
      Copy
    </watt-menu-item>
    <watt-menu-item (click)="onAction('Paste')">
      <watt-icon name="plus" />
      Paste
    </watt-menu-item>
  </watt-menu-group>

  <watt-menu-group label="View">
    <watt-menu-item (click)="onAction('Zoom In')">
      <watt-icon name="up" />
      Zoom In
    </watt-menu-item>
    <watt-menu-item (click)="onAction('Zoom Out')">
      <watt-icon name="down" />
      Zoom Out
    </watt-menu-item>
    <watt-menu-item (click)="onAction('Reset Zoom')">
      <watt-icon name="refresh" />
      Reset Zoom
    </watt-menu-item>
  </watt-menu-group>
</watt-menu>`;

const menuGroupedNoIconsTemplate = `<watt-button
  variant="secondary"
  [wattMenuTriggerFor]="menuNoIcons"
  aria-label="Open menu without icons"
>
  File
  <watt-icon name="down" size="xs" />
</watt-button>

<watt-menu #menuNoIcons>
  <watt-menu-group label="File">
    <watt-menu-item (click)="onAction('New')">New</watt-menu-item>
    <watt-menu-item (click)="onAction('Open')">Open</watt-menu-item>
    <watt-menu-item (click)="onAction('Save')">Save</watt-menu-item>
  </watt-menu-group>

  <watt-menu-group label="Edit">
    <watt-menu-item (click)="onAction('Cut')">Cut</watt-menu-item>
    <watt-menu-item (click)="onAction('Copy')">Copy</watt-menu-item>
    <watt-menu-item (click)="onAction('Paste')">Paste</watt-menu-item>
  </watt-menu-group>

  <watt-menu-group label="View">
    <watt-menu-item (click)="onAction('Zoom In')">Zoom In</watt-menu-item>
    <watt-menu-item (click)="onAction('Zoom Out')">Zoom Out</watt-menu-item>
    <watt-menu-item (click)="onAction('Reset Zoom')">Reset Zoom</watt-menu-item>
  </watt-menu-group>
</watt-menu>`;

const menuGroupedMixedIconsTemplate = `<watt-button
  variant="secondary"
  [wattMenuTriggerFor]="menuMixed"
  aria-label="Open menu with mixed icons"
>
  File
  <watt-icon name="down" size="xs" />
</watt-button>

<watt-menu #menuMixed>
  <watt-menu-group label="File">
    <watt-menu-item (click)="onAction('New')">
      <watt-icon name="plus" />
      New
    </watt-menu-item>
    <watt-menu-item (click)="onAction('Open')">Open</watt-menu-item>
    <watt-menu-item (click)="onAction('Save')">
      <watt-icon name="save" />
      Save
    </watt-menu-item>
  </watt-menu-group>

  <watt-menu-group label="Edit">
    <watt-menu-item (click)="onAction('Cut')">
      <watt-icon name="minus" />
      Cut
    </watt-menu-item>
    <watt-menu-item (click)="onAction('Copy')">Copy</watt-menu-item>
    <watt-menu-item (click)="onAction('Paste')">
      <watt-icon name="plus" />
      Paste
    </watt-menu-item>
  </watt-menu-group>

  <watt-menu-group label="View">
    <watt-menu-item (click)="onAction('Zoom In')">Zoom In</watt-menu-item>
    <watt-menu-item (click)="onAction('Zoom Out')">
      <watt-icon name="down" />
      Zoom Out
    </watt-menu-item>
    <watt-menu-item (click)="onAction('Reset Zoom')">Reset Zoom</watt-menu-item>
  </watt-menu-group>
</watt-menu>`;

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
