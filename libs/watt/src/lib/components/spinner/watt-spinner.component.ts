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
import { Component, HostBinding, Input } from '@angular/core';
/**
 * Usage:
 * `import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';`
 */
@Component({
  selector: 'watt-spinner',
  standalone: true,
  styleUrls: ['./watt-spinner.component.scss'],
  template: `<svg class="spinner" viewBox="0 0 50 50">
    <circle class="path" cx="25" cy="25" r="20" fill="none" [attr.stroke-width]="strokeWidth" />
  </svg>`,
})
export class WattSpinnerComponent {
  @HostBinding('attr.role') role = 'progressbar';

  @HostBinding('style')
  get style(): string {
    return `--watt-spinner-diameter: ${this.diameter}px`;
  }

  @Input() diameter = 44;

  @Input() strokeWidth = 5;
}
