import { Component, Input, ViewEncapsulation } from '@angular/core';
import { WattIcon } from '../../foundations/icon';

export type WattButtonVariant = 'primary' | 'secondary' | 'text' | 'icon';
export type WattButtonSize = 'normal' | 'large';

@Component({
  selector: 'watt-button-alt',
  template: `
    <button mat-button [ngClass]="variant" [disabled]="disabled">
      <watt-spinner
        *ngIf="loading"
        [diameter]="18"
        class="content-grid-item content-grid-item-spinner"
      ></watt-spinner>
      <watt-icon *ngIf="hasIcon()" [name]="icon"></watt-icon>
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./watt-button-alt.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WattButtonAltComponent {
  @Input() icon?: WattIcon;
  @Input() variant: WattButtonVariant = 'primary';
  @Input() size: WattButtonSize = 'normal';
  @Input() disabled = false;
  @Input() loading = false;

  hasIcon(): boolean {
    return !!this.icon;
  }
}
