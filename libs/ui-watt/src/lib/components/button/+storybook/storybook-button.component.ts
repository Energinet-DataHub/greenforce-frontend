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
import { Component, Input } from '@angular/core';
import { WattButtonVariant } from '../watt-button.component';
import { WattButtonModule } from '../watt-button.module';

@Component({
  standalone: true,
  imports: [WattButtonModule],
  selector: 'watt-storybook-button',
  styles: [
    `
      div {
        display: grid;
        grid-template-columns: repeat(3, min-content);
        grid-gap: var(--watt-space-m);
      }
    `,
  ],
  template: `
    <div>
      <watt-button [variant]="variant">Enabled</watt-button>
      <watt-button [variant]="variant" [disabled]="true">Disabled</watt-button>
      <watt-button [variant]="variant" [loading]="true">Hidden</watt-button>
      <watt-button [variant]="variant" icon="plus">Enabled</watt-button>
      <watt-button [variant]="variant" icon="plus" [disabled]="true">
        Disabled
      </watt-button>
    </div>
  `,
})
export class WattStorybookButtonComponent {
  @Input() variant: WattButtonVariant = 'primary';
}
