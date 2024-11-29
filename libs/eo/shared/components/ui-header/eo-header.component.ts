import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EoProductLogoDirective } from '@energinet-datahub/eo/shared/components/ui-product-logo';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatToolbarModule, EoProductLogoDirective],
  selector: 'eo-header',
  styles: [
    `
      :host {
        @media print {
          display: none;
        }
      }

      .toolbar {
        display: flex;
        justify-content: space-between;
        background-color: var(--watt-color-neutral-white);
        border-bottom: 1px solid var(--watt-color-neutral-grey-300);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
        height: var(--watt-space-xl);
      }

      .logo {
        height: var(--watt-space-l);
        min-width: 255px; // Magic UX number
        padding-right: var(--watt-space-m);
      }
    `,
  ],
  template: `
    <mat-toolbar class="toolbar watt-space-inset-squished-m">
      <img eoProductLogo class="logo" />
      <ng-content />
    </mat-toolbar>
  `,
})
export class EoHeaderComponent {}
