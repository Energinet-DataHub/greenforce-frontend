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
import { Component } from '@angular/core';
import { WattButtonComponent } from '../../button';
import { WattIconComponent } from '../../icon';
import { WattMenuComponent } from '../watt-menu.component';
import { WattMenuItemComponent } from '../watt-menu-item.component';
import { WattMenuTriggerDirective } from '../watt-menu-trigger.directive';

@Component({
  selector: 'watt-menu-basic-story',
  standalone: true,
  template: `
    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
      <div>
        <h3>All items with icons</h3>
        <watt-button
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
        </watt-menu>
      </div>

      <div>
        <h3>No icons</h3>
        <watt-button
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
        </watt-menu>
      </div>

      <div>
        <h3>Mixed (some with icons)</h3>
        <watt-button
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
        </watt-menu>
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
export class MenuBasicStoryComponent {
  lastAction: string | null = null;

  onAction(action: string) {
    this.lastAction = action;
  }
}