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
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostBinding, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Usage example: If you have an API call error observable you subscribe to,
 * you can use the following method to show an error if it fails
 *
 * <ng-container *rxLet="error$ as error">
 * <eo-popup-message *ngIf="error" [errorMessage]="error"> </eo-popup-message>
 * </ng-container>
 */

@Component({
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule],
  selector: 'eo-popup-message',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;
      :host {
        display: block;

        @include watt.media('<Large') {
          margin: -16px;

          .mat-card {
            border-radius: 0;
          }
        }

        &.hidden {
          display: none;
        }
      }

      .container {
        display: flex;
        align-items: flex-start;

        img {
          padding-right: var(--watt-space-m);
        }

        .content {
          flex-direction: column;
          flex-grow: 2;
        }
      }

      .mat-card {
        background-color: var(--watt-color-state-danger-light);
        padding: var(--watt-space-m);
      }

      .close {
        padding-left: var(--watt-space-s);

        mat-icon {
          color: var(--watt-color-primary);
        }
      }
    `,
  ],
  template: `
    <div class="mat-card watt-space-stack-l container">
      <img alt="Danger icon" src="/assets/icons/danger.svg" />
      <div class="content">
        <h4 class="watt-space-stack-s">We have experienced an issue</h4>
        <p>please try again or try reloading the page.</p>
      </div>

      <a class="close" (click)="hidden = true"><mat-icon>close</mat-icon></a>
    </div>
  `,
})
export class EoPopupMessageComponent {
  @HostBinding('class.hidden') hidden = false;

  @Input() errorMessage: HttpErrorResponse | null = null;
}
