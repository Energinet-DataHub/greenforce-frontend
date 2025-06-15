import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';
import { translations } from '@energinet-datahub/eo/translations';

@Component({
  selector: 'eo-login-modal',
  standalone: true,
  imports: [CommonModule, WattButtonComponent, WattIconComponent, TranslocoPipe],
  template: `
    @if (isOpen()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ translations.loginModal.title | transloco }}</h2>
            <watt-button variant="text" icon="close" (click)="closeModal()"></watt-button>
          </div>

          <div class="modal-body">
            <p>{{ translations.loginModal.subtitle | transloco }}</p>

            <div class="login-options">
              <watt-button
                class="login-option trial"
                variant="secondary"
                (click)="handleLogin('trial')"
              >
                <watt-icon name="user-check" />
                <div class="option-content">
                  <span class="option-title">{{ translations.loginModal.trial.title | transloco }}</span>
                  <span class="option-subtitle">{{ translations.loginModal.trial.subtitle | transloco }}</span>
                </div>
              </watt-button>

              <watt-button
                class="login-option normal"
                variant="primary"
                (click)="handleLogin('normal')"
              >
                <watt-icon name="user" />
                <div class="option-content">
                  <span class="option-title">{{ translations.loginModal.normal.title | transloco }}</span>
                  <span class="option-subtitle">{{ translations.loginModal.normal.subtitle | transloco }}</span>
                </div>
              </watt-button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      max-width: 400px;
      width: 90%;
      max-height: 90vh;
      overflow: auto;
      animation: slideUp 0.3s ease;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid var(--watt-color-neutral-grey-200);
    }

    .modal-header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .modal-body {
      padding: 24px;
    }

    .modal-body p {
      margin-bottom: 24px;
      color: var(--watt-on-light-medium-emphasis);
    }

    .login-options {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .login-option {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      text-align: left;
      width: 100%;
      min-height: 80px;
      border: 2px solid transparent;
      transition: all 0.2s ease;
    }

    .login-option:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .login-option.trial:hover {
      border-color: var(--watt-color-primary-light);
    }

    .login-option.normal:hover {
      border-color: var(--watt-color-primary);
    }

    .option-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .option-title {
      font-weight: 600;
      font-size: 16px;
    }

    .option-subtitle {
      font-size: 14px;
      color: var(--watt-on-light-medium-emphasis);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class EoLoginModalComponent {
  private authService = inject(EoAuthService);
  protected translations = translations;

  isOpen = signal(false);

  openModal() {
    this.isOpen.set(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isOpen.set(false);
    document.body.style.overflow = '';
  }

  handleLogin(loginType: 'trial' | 'normal') {
    const ettLoginType = loginType === 'trial'
      ? 'ett:login:type:trial'
      : 'ett:login:type:normal';

    // Get current URL for redirect
    const currentUrl = window.location.href;

    this.authService.loginWithType({
      ettLoginType,
      redirectUrl: currentUrl
    });

    this.closeModal();
  }
}
