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
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  WritableSignal,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattIconComponent } from '@energinet-datahub/watt/icon';

import { WindowService } from '@energinet-datahub/gf/util-browser';
import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';
import { translations } from '@energinet-datahub/eo/translations';
import { EoLoginModalComponent } from './login-modal.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WattButtonComponent, TranslocoPipe, WattIconComponent, EoLoginModalComponent],
  selector: 'eo-login-button',
  template: `
    @if (type() === 'default') {
      <button class="button primary" (click)="onClick()">
        <watt-icon name="login" />
        {{ translations.loginButton.unauthenticated | transloco }}
      </button>
    } @else {
      <watt-button variant="text" class="login" data-testid="login-button" (click)="onClick()">
        {{ translations.loginButton.unauthenticated | transloco }}
      </watt-button>
    }

    <eo-login-modal #loginModal />
  `,
})
export class EoLoginButtonComponent {
  type = input<'text' | 'default'>('default');

  @ViewChild('loginModal') loginModal!: EoLoginModalComponent;

  private readonly authService = inject(EoAuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly window = inject(WindowService).nativeWindow;

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
      this.loginModal.openModal();
    }
  }

  private gotoDashboard() {
    if (!this.window) return;
    const currentUrl = this.window.location.href;
    this.window.location.href = `${currentUrl}/dashboard`;
  }
}
