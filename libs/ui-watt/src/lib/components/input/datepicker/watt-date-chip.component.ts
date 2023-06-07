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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { WattDatePipe } from '../../../utils/date/watt-date.pipe';
import { WattIconComponent } from '../../../foundations/icon/icon.component';
import { WattMenuChipComponent } from '../../chip/watt-menu-chip.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    WattMenuChipComponent,
    WattDatePipe,
    WattIconComponent,
  ],
  selector: 'watt-date-chip',
  styles: [
    `
      input {
        top: 0;
        bottom: 0;
        height: auto;
        visibility: hidden;
      }
    `,
  ],
  template: `
    <mat-datepicker #picker />
    <watt-menu-chip
      hasPopup="dialog"
      [disabled]="disabled"
      [selected]="!!value"
      [opened]="picker.opened"
      (toggle)="picker.open()"
    >
      <input
        tabindex="-1"
        class="cdk-visually-hidden"
        type="text"
        [value]="value"
        [matDatepicker]="picker"
        (dateChange)="value = $event.value"
        (dateChange)="selectionChange.emit($event.value)"
      />
      <ng-content *ngIf="!value" />
      <ng-container *ngIf="value">{{ value | wattDate }}</ng-container>
    </watt-menu-chip>
  `,
})
export class WattDateChipComponent {
  @Input() disabled = false;
  @Input() label?: string;
  @Input() value?: string;
  @Output() selectionChange = new EventEmitter<string>();
}
