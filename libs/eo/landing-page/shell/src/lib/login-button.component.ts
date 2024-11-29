import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  WritableSignal,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@ngneat/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattIconComponent } from '@energinet-datahub/watt/icon';

import { WindowService } from '@energinet-datahub/gf/util-browser';
import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';
import { translations } from '@energinet-datahub/eo/translations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WattButtonComponent, TranslocoPipe, WattIconComponent],
  selector: 'eo-login-button',
  template: `
    @if (type() === 'default') {
      <button class="button primary" (click)="onClick()">
        <watt-icon name="login" />
        @if (isLoggedIn()) {
          {{ translations.loginButton.authenticated | transloco }}
        } @else {
          {{ translations.loginButton.unauthenticated | transloco }}
        }
      </button>
    } @else {
      <watt-button variant="text" class="login" data-testid="login-button" (click)="onClick()">
        @if (isLoggedIn()) {
          {{ translations.loginButton.authenticated | transloco }}
        } @else {
          {{ translations.loginButton.unauthenticated | transloco }}
        }
      </watt-button>
    }
  `,
})
export class EoLoginButtonComponent {
  type = input<'text' | 'default'>('default');

  private authService = inject(EoAuthService);
  private destroyRef = inject(DestroyRef);
  private window = inject(WindowService).nativeWindow;

  protected translations = translations;
  protected isLoggedIn!: WritableSignal<boolean>;

  constructor() {
    this.setIsLoggedIn();
  }

  private setIsLoggedIn() {
    this.authService.isLoggedIn().then((res) => {
      this.isLoggedIn = signal<boolean>(res);
    });

    this.authService.addUserUnloaded$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.isLoggedIn?.set(false);
    });
  }

  onClick() {
    if (this.isLoggedIn()) {
      this.gotoDashboard();
    } else {
      this.login();
    }
  }

  private gotoDashboard() {
    if (!this.window) return;
    const currentUrl = this.window.location.href;
    this.window.location.href = `${currentUrl}/dashboard`;
  }

  private login() {
    this.authService.login();
  }
}
