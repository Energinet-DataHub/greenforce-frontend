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
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

export interface WattChipsOption {
  /** Text to display on the chip. */
  label: string;
  /** Value to emit when selected. */
  value: string;
}

export type WattChipsSelection = string | null;

/**
 * Simple implementation of Material "Choice chips".
 * @see https://material.io/components/chips#choice-chips
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-chips',
  styleUrls: ['./watt-chips.component.scss'],
  templateUrl: './watt-chips.component.html',
})
export class WattChipsComponent {
  /** List of chip options to display. */
  @Input() options: WattChipsOption[] = [];

  /** Holds the currently selected chip value. */
  @Input() selection: WattChipsSelection = null;

  /** Emits selection whenever it changes. */
  @Output() selectionChange = new EventEmitter<WattChipsSelection>();

  /**
   * Click handler for updating selection.
   * @ignore
   */
  onClick(selection: WattChipsSelection) {
    if (this.selection !== selection) {
      this.selection = selection;
      this.selectionChange.emit(this.selection);
    }
  }
}
