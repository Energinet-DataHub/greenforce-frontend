import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';

type Variant = 'normal' | 'dark' | 'light';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-info-box',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
        padding: var(--watt-space-m);

        ::ng-deep img {
          margin: 0 auto var(--watt-space-m);
          display: block;
        }

        &.dark {
          background-color: var(--watt-color-primary-dark);

          ::ng-deep {
            & > * {
              color: var(--watt-color-neutral-white);
            }
          }
        }

        &.light {
          background-color: var(--watt-color-secondary-light);
        }
      }
    `,
  ],
  template: `<ng-content></ng-content>`,
})
export class EoInfoBoxComponent implements OnInit {
  @Input() variant: Variant = 'normal';

  constructor(private _elementRef: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this._elementRef.nativeElement.className = this.variant;
  }
}
