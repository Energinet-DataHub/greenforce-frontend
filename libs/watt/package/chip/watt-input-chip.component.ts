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
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { WattIconComponent } from '@energinet/watt/icon';

@Component({
  imports: [WattIconComponent],
  selector: 'watt-input-chip',
  styleUrls: ['./watt-input-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="watt-input-chip" [class.disabled]="disabled()">
      <span class="watt-input-chip__label">
        {{ label() }}
      </span>
      <button
        type="button"
        class="watt-input-chip__remove"
        [disabled]="disabled()"
        [attr.aria-label]="'Remove'"
        (click)="removed.emit()"
      >
        <watt-icon name="close" size="s" [attr.aria-hidden]="true" />
      </button>
    </div>
  `,
})
export class WattInputChipComponent {
  label = input.required<string>();
  disabled = input(false);
  removed = output<void>();
}
