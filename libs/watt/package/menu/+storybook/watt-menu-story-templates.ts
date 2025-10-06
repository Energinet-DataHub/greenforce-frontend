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

export const menuWithIconsTemplate = `<watt-button
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

export const menuNoIconsTemplate = `<watt-button
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

export const menuMixedIconsTemplate = `<watt-button
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

export const menuGroupedWithIconsTemplate = `<watt-button
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

export const menuGroupedNoIconsTemplate = `<watt-button
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

export const menuGroupedMixedIconsTemplate = `<watt-button
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