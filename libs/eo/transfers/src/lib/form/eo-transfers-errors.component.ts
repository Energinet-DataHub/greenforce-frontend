import { Component, HostBinding, Input, ViewEncapsulation } from "@angular/core";

@Component({
  standalone: true,
  selector: 'eo-transfers-errors',
  styles: [`
    @use '@energinet-datahub/watt/utils' as watt;

    eo-transfers-errors {
      display: block;
      margin-top: var(--watt-space-xs);
      min-height: 48px;
      overflow: hidden;
      padding-left: var(--watt-space-s);
      position: relative;
      width: 100%;

      watt-error {
        @include watt.typography-watt-text-s;
        position: absolute;
        transition: opacity, transform 150ms linear;
        transform: translate3d(0, -100%, 0);
      }

      &.show-error watt-error {
        transform: translate3d(0, 0, 0);
      }
    }
  `],
  template: `<ng-content></ng-content>`,
  encapsulation: ViewEncapsulation.None
})
export class EoTransferErrorsComponent {
  @Input() showError = false;

  @HostBinding('class.show-error')
  get hasError() {
    return this.showError;
  }
}
