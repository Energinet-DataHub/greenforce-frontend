import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { WattButtonModule } from '@energinet-datahub/watt';

@Component({
  selector: 'eo-cookie-banner',
  template: `
    <div class="banner">
      <mat-card>
        <h1>This website uses cookies</h1>
        <p>
          Some are used for statistics and others are set by third party
          services.
        </p>
        <p>
          By clicking OK you accept the use of the types of cookies selected
          below.
        </p>
        <div class="buttons">
          <watt-button
            variant="secondary"
            (click)="cookies.statisticalEnabled = false"
            >Functional only</watt-button
          >
          <watt-button (click)="saveCookieSettings()">OK</watt-button>
        </div>
        <div class="checkboxes">
          <label for="essential">Functional</label>
          <input
            class="checkbox"
            type="checkbox"
            [(ngModel)]="cookies.functionalEnabled"
            disabled
          />
          <div class="vertical-divider"></div>
          <label for="statistical">Statistical</label>
          <input
            class="checkbox"
            type="checkbox"
            [(ngModel)]="cookies.statisticalEnabled"
          />
        </div>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .checkboxes {
        display: flex;
        align-items: center;
      }

      .checkbox {
        margin: 0 var(--watt-space-m);
      }

      .banner {
        position: absolute;
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
        width: 160px; //Magic UX number
      }

      .vertical-divider {
        height: 20px;
        border-right: 1px solid var(--watt-color-primary);
        margin: 0 var(--watt-space-m) 0 var(--watt-space-s);
      }
    `,
  ],
})
export class EoCookieBannerComponent {
  cookies = {
    functionalEnabled: true,
    statisticalEnabled: false,
  };

  @Output() accepted = new EventEmitter<boolean>();

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
export class EoCookieBannerComponentScam {}
