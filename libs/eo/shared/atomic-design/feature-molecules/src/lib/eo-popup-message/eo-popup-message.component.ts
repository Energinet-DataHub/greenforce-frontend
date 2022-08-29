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
import { Component, HostBinding, Input, NgModule } from '@angular/core';
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
      }

      .content {
        flex-direction: column;
        flex-grow: 2;
      }

      .inline {
        display: inline-block;
      }

      .mat-card {
        background-color: var(--watt-color-state-danger-light);
        padding: var(--watt-space-m);
      }

      img {
        padding-right: var(--watt-space-m);
      }

      mat-icon {
        color: var(--watt-color-primary);
      }

      .close {
        padding-left: var(--watt-space-s);
      }

      .see-details {
        display: inline-flex;
        position: absolute;
        right: var(--watt-space-m);
        text-decoration: none;
      }

      .error-message {
        margin-top: var(--watt-space-m);
        max-height: 200px;
        transition: max-height 0.25s ease-in;
        overflow: hidden;

        &.collapsed {
          max-height: 0;
          transition: max-height 0.25s ease-out;
        }
      }
    `,
  ],
  template: `
    <div class="mat-card watt-space-stack-l container">
      <img alt="Danger icon" src="/assets/icons/danger.svg" />
      <div class="content">
        <h4 class="watt-space-stack-s">Oops! Something went wrong...</h4>
        <p class="watt-space-stack-m">
          We apologize for the inconvenience, please reload the page or try
          again. <br />
          If you still experience issues, you are welcome to contact customer
          service, and we will help you proceed.
        </p>
        <p class="inline">
          <a
            href="mailto:datahub@energinet.dk?subject=Error on energioprindelse.dk&body=**Write your message here, but please keep the lines below intact for our internal investigations**%0D%0A%0D%0AError code:{{
              errorMessage?.status
            }}%0D%0A{{ errorMessage?.message }}"
            >Contact customer service</a
          >
        </p>

        <a
          *ngIf="errorMessage"
          class="see-details"
          (click)="errorCollapsed = !errorCollapsed"
        >
          See details
          <mat-icon *ngIf="errorCollapsed">expand_more</mat-icon>
          <mat-icon *ngIf="!errorCollapsed">expand_less</mat-icon>
        </a>

        <div
          *ngIf="errorMessage"
          class="error-message collapsed"
          [ngClass]="{ collapsed: errorCollapsed }"
        >
          <h4>Error code: {{ errorMessage?.status }}</h4>
          {{ errorMessage?.message }}
        </div>
      </div>

      <a class="close" (click)="hidden = true"><mat-icon>close</mat-icon></a>
    </div>
  `,
})
export class EoPopupMessageComponent {
  errorCollapsed = true;
  @HostBinding('class.hidden') hidden = false;

  @Input() errorMessage: HttpErrorResponse | null = null;
}

@NgModule({
  declarations: [EoPopupMessageComponent],
  exports: [EoPopupMessageComponent],
  imports: [MatButtonModule, MatIconModule, CommonModule],
})
export class EoPopupMessageScam {}
