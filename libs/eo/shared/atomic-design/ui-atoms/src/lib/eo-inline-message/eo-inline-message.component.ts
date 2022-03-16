import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';

import { CommonModule } from '@angular/common';

const selector = 'eo-inline-message';

@Component({
  selector,
  styles: [
    `
      ${selector} {
        display: block;
      }
      .${selector}__container {
        display: grid;
        grid-template-columns: 70px 1fr;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.08);

        &.default {
          background: var(--watt-color-neutral-white);
          color: var(--watt-color-primary-dark);
        }
        &.info {
          background: var(--watt-color-state-info);
          color: var(--watt-color-neutral-white);
        }
        &.success {
          background: var(--watt-color-state-success);
          color: var(--watt-color-neutral-white);
        }
        &.danger {
          background: var(--watt-color-state-danger);
          color: var(--watt-color-neutral-white);
        }
        &.warning {
          background: #fef5d5; // var(--watt-color-state-warning); // Wrong yellow watt vs Figma
          color: var(--watt-color-primary-dark);
        }
      }
      .${selector}__icon {
        width: calc(8 * var(--watt-space-xs));
        height: calc(8 * var(--watt-space-xs));
        margin: calc(4 * var(--watt-space-xs));
      }
      .${selector}__content {
        padding-right: var(--watt-space-m);
      }
    `,
  ],
  template: `
    <div
      class="${selector}__container"
      [ngClass]="{
        info: type === 'info',
        success: type === 'success',
        danger: type === 'danger',
        warning: type === 'warning',
        default: type === 'default'
      }"
    >
      <div>
        <img
          *ngIf="icon"
          class="${selector}__icon"
          src="{{ icon }}"
          alt="EnergyOrigin"
        />
      </div>
      <div class="${selector}__content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class EoInlineMessageComponent {
  @Input()
  icon!: string;

  @Input()
  type: 'info' | 'success' | 'danger' | 'warning' | 'default' = 'default';
}

@NgModule({
  imports: [CommonModule],
  declarations: [EoInlineMessageComponent],
  exports: [EoInlineMessageComponent],
})
export class EoInlineMessageScam {}
