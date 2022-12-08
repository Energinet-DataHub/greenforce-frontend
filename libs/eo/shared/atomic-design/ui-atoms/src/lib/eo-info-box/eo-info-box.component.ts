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
