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
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

export interface WattSegmentedButton {
  label: string;
  value: string;
}

/**
 * Segmented buttons.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatButtonToggleModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattSegmentedButtonsComponent),
      multi: true,
    },
  ],
  selector: 'watt-segmented-buttons',
  styleUrls: ['./watt-segmented-buttons.component.scss'],
  template: ` <mat-button-toggle-group [multiple]="false" [hideSingleSelectionIndicator]="true">
    @for (button of buttons(); track button.value) {
      <mat-button-toggle [value]="button.value">
        {{ button.label }}
      </mat-button-toggle>
    }
  </mat-button-toggle-group>`,
})
export class WattSegmentedButtonsComponent implements ControlValueAccessor {
  buttons = input<WattSegmentedButton[]>([]);
  selected = input<string>();

  writeValue(checked: boolean): void {
    // this.checked.set(checked);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    // this.checked.subscribe(fn);
  }

  registerOnTouched(fn: (value: boolean) => void): void {
    // this.element.nativeElement.addEventListener('focusout', fn);
  }

  setDisabledState?(isDisabled: boolean): void {
    // this.isDisabled.set(isDisabled);
  }
}
