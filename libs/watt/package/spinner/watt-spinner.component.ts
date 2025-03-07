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
import { Component, computed, input } from '@angular/core';

/**
 * Usage:
 * `import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';`
 */
@Component({
  selector: 'watt-spinner',
  styles: `
    :host {
      --watt-spinner-circle-color: var(--watt-color-primary);

      display: block;
      width: var(--watt-spinner-diameter);
      height: var(--watt-spinner-diameter);
      position: relative;
    }

    .spinner {
      animation: rotate 2s linear infinite;
      z-index: 2;
      position: absolute;
      top: 50%;
      left: 50%;
      margin: calc(var(--watt-spinner-diameter) / 2 * -1) 0 0
        calc(var(--watt-spinner-diameter) / 2 * -1);
      width: var(--watt-spinner-diameter);
      height: var(--watt-spinner-diameter);

      & .path {
        stroke: var(--watt-spinner-circle-color);
        stroke-linecap: round;
        animation: dash 1.5s ease-in-out infinite;
      }
    }

    @keyframes rotate {
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes dash {
      0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
      }
      100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
      }
    }
  `,
  host: {
    role: 'progressbar',
    '[style]': 'diameterSize()',
  },
  template: `<svg class="spinner" viewBox="0 0 50 50">
    <circle class="path" cx="25" cy="25" r="20" fill="none" [attr.stroke-width]="strokeWidth()" />
  </svg>`,
})
export class WattSpinnerComponent {
  /**
   * @ignore
   */
  diameterSize = computed(() => `--watt-spinner-diameter: ${this.diameter()}px`);

  diameter = input(44);
  strokeWidth = input(5);
}
