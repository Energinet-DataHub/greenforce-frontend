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
  contentChildren,
  ElementRef,
  forwardRef,
  inject,
  model,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgTemplateOutlet } from '@angular/common';
import { WattSegmentedButtonComponent } from './watt-segmented-button.component';

/**
 * Segmented buttons.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatButtonToggleModule, FormsModule, NgTemplateOutlet],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattSegmentedButtonsComponent),
      multi: true,
    },
  ],
  selector: 'watt-segmented-buttons',
  styleUrls: ['./watt-segmented-buttons.component.scss'],
  template: ` <mat-button-toggle-group
    [(ngModel)]="selected"
    [multiple]="false"
    [hideSingleSelectionIndicator]="true"
    [disabled]="disabled()"
  >
    @for (segmentedButton of segmentedButtonElements(); track segmentedButton) {
      <mat-button-toggle [disableRipple]="true" [value]="segmentedButton.value()">
        <ng-container *ngTemplateOutlet="segmentedButton.templateRef()" />
      </mat-button-toggle>
    }
  </mat-button-toggle-group>`,
})
export class WattSegmentedButtonsComponent implements ControlValueAccessor {
  segmentedButtonElements = contentChildren(WattSegmentedButtonComponent);
  selected = model<string>('');
  disabled = signal(false);
  private element = inject(ElementRef);

  writeValue(selected: string): void {
    this.selected.set(selected);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.selected.subscribe(fn);
  }

  registerOnTouched(fn: (value: boolean) => void): void {
    this.element.nativeElement.addEventListener('focusout', fn);
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
