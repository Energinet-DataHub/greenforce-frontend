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
  template: `<svg
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    aria-hidden="true"
    style="width:{{ diameter }}px; height: {{ diameter }}px;"
    viewBox="0 0 38.4 38.4"
  >
    <circle
      cx="50%"
      cy="50%"
      style="animation-name:circleRotate; stroke-dasharray: 106.814px; stroke-width: 10%; transform-origin: 50% 50% 0px;"
      r="17"
    ></circle>
  </svg>`,
})
export class WattSpinnerComponent {
  @HostBinding('attr.role') role = 'progressbar';
  @HostBinding('style')
  get style(): string {
    return `--watt-spinner-diameter: ${this.diameter}px`;
  }
  @Input() diameter = 44;
}
