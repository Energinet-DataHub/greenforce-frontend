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
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { WattButtonModule } from '@energinet-datahub/watt/button';

@Component({
  selector: 'eo-cookie-banner',
  styles: [
    `
      :host {
        position: fixed;
        z-index: 100;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      mat-card.mat-card {
        gap: var(--watt-space-m);
        display: flex;
        flex-direction: column;
        border: 1px solid var(--watt-color-primary);
      }

      .buttons {
        gap: var(--watt-space-l);
        display: flex;
        margin: 0 auto var(--watt-space-m) auto;
      }

      watt-button ::ng-deep button {
        width: 160px; // Magic UX number
      }
    `,
  ],
  template: `
    <mat-card>
      <h1>No cookies, no energy</h1>
      <p>Some are used for statistics and others are set by third party services.</p>
      <p>By clicking OK you accept the use of the types of cookies selected below.</p>
      <div class="buttons">
        <watt-button
          data-testid="button-only-necessary"
          variant="secondary"
          (click)="acceptNecessaryCookies()"
          >Only necessary
        </watt-button>
        <watt-button data-testid="button-accept-all" (click)="acceptAllCookies()"
          >Accept all
        </watt-button>
      </div>
    </mat-card>
  `,
})
export class EoCookieBannerComponent {
  cookies = {
    functionalEnabled: true,
    statisticalEnabled: false,
  };

  @Output() accepted = new EventEmitter<boolean>();

  acceptNecessaryCookies() {
    this.cookies.statisticalEnabled = false;
    this.saveCookieSettings();
  }

  acceptAllCookies() {
    this.cookies.statisticalEnabled = true;
    this.saveCookieSettings();
  }

  saveCookieSettings() {
    localStorage.setItem('cookiesAccepted', JSON.stringify(this.cookies));
    this.accepted.emit(true);
  }
}

@NgModule({
  declarations: [EoCookieBannerComponent],
  exports: [EoCookieBannerComponent],
  imports: [WattButtonModule, MatCardModule, MatSlideToggleModule, FormsModule],
})
export class EoCookieBannerComponentComponent {}
