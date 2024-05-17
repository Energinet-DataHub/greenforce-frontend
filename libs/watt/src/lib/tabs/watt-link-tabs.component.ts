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
import { Component, ViewEncapsulation, contentChildren } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { VaterFlexComponent } from '@energinet-datahub/watt/vater';

import { WattLinkTabComponent } from './watt-link-tab.component';

@Component({
  standalone: true,
  selector: 'watt-link-tabs',
  encapsulation: ViewEncapsulation.None,
  imports: [MatTabsModule, RouterOutlet, RouterLink, RouterLinkActive, VaterFlexComponent],
  styles: `
    @use '@energinet-datahub/watt/utils' as watt;
    watt-link-tabs {
      .mat-mdc-tab-header {
        box-shadow: var(--watt-bottom-box-shadow);
        background-color: var(--watt-color-neutral-white);
      }

      .mat-mdc-tab-nav-panel {
        display: block;
        position: relative;
        height: 100%;
      }

      .mat-mdc-tab-links,
      .mat-mdc-focus-indicator.mat-mdc-tab-link.active .mdc-tab__text-label {
        color: var(--mat-tab-header-active-label-text-color);
      }

      .mat-mdc-tab-labels,
      .mat-mdc-tab-links {
        padding-left: var(--watt-space-ml);
      }

      .mat-mdc-tab,
      .mat-mdc-tab-link {
        min-width: 120px;
        opacity: 1;

        .mdc-tab__content {
          @include watt.typography-watt-button;
          color: var(--watt-on-light-medium-emphasis);
        }

        &.mat-mdc-tab-active,
        &.mat-mdc-tab-link.active {
          border-bottom: 2px solid var(--watt-color-primary);
        }
        &.mat-mdc-tab:hover,
        &.mat-mdc-tab-link:hover {
          border-bottom: 2px solid var(--watt-color-primary);
        }

        &.mat-mdc-tab-active,
        &.mat-mdc-tab-link.active,
        &.mat-mdc-tab:hover,
        &.mat-mdc-tab-link:hover {
          color: var(--watt-on-light-medium-emphasis);

          .mdc-tab__content {
            color: var(--watt-color-primary);
          }
        }
      }
    }
  `,
  template: ` <vater-flex direction="column" fill="vertical">
    <nav
      mat-tab-nav-bar
      [disableRipple]="true"
      animationDuration="0ms"
      [mat-stretch-tabs]="false"
      [tabPanel]="tabPanel"
    >
      @for (tab of tabElements(); track tab) {
        <a mat-tab-link routerLink="{{ tab.link() }}" routerLinkActive="active">
          {{ tab.label() }}
        </a>
      }
    </nav>

    <mat-tab-nav-panel #tabPanel> <router-outlet /> </mat-tab-nav-panel
  ></vater-flex>`,
})
export class WattLinkTabsComponent {
  tabElements = contentChildren(WattLinkTabComponent);
}
