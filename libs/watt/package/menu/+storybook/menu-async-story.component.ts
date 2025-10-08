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
import { Component, Input, signal, OnInit, OnDestroy } from '@angular/core';
import { WattButtonComponent } from '../../button';
import { WattIconComponent } from '../../icon';
import { WattMenuComponent } from '../watt-menu.component';
import { WattMenuItemComponent } from '../watt-menu-item.component';
import { WattMenuTriggerDirective } from '../watt-menu-trigger.directive';

@Component({
  selector: 'watt-menu-async-story',
  imports: [
    WattButtonComponent,
    WattIconComponent,
    WattMenuComponent,
    WattMenuItemComponent,
    WattMenuTriggerDirective,
  ],
  template: `
    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
      <div>
        <h3>Async Menu Items (Dynamic Icons)</h3>
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
              Settings (always no icon)
            </watt-menu-item>
            <watt-menu-item (click)="onAction('Preferences')">
              @if (showIcons) {
                <watt-icon name="settings" />
              }
              Preferences
            </watt-menu-item>
            <watt-menu-item (click)="onAction('Help')"> Help (always no icon) </watt-menu-item>
            <watt-menu-item (click)="onAction('Logout')">
              @if (showIcons) {
                <watt-icon name="logout" />
              }
              Logout
            </watt-menu-item>
          }
        </watt-menu>
      </div>
    </div>

    <p style="margin-top: 20px">Last action: {{ lastAction() || 'None' }}</p>
    <p>Items loaded: {{ itemsLoaded() ? 'Yes' : 'No (loading...)' }}</p>
  `,
})
export class MenuAsyncStoryComponent implements OnInit, OnDestroy {
  @Input() showIcons = true;
  @Input() set loadDelay(value: number) {
    this._loadDelay = value;
    this.resetLoading();
  }
  get loadDelay(): number {
    return this._loadDelay;
  }

  private _loadDelay = 1000;
  private loadingTimeout?: ReturnType<typeof setTimeout>;

  itemsLoaded = signal(false);
  lastAction = signal<string | null>(null);

  ngOnInit() {
    this.resetLoading();
  }

  ngOnDestroy() {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
  }

  private resetLoading() {
    // Clear any existing timeout
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }

    // Reset loaded state
    this.itemsLoaded.set(false);

    // Start new loading timeout
    this.loadingTimeout = setTimeout(() => {
      this.itemsLoaded.set(true);
    }, this._loadDelay);
  }

  onAction(action: string) {
    this.lastAction.set(action);
  }
}
