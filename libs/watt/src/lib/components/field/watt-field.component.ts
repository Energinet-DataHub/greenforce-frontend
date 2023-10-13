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
import { NgIf, NgClass } from '@angular/common';
import {
  Component,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'watt-field',
  standalone: true,
  imports: [NgIf, NgClass],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./watt-field.component.scss'],
  template: `
    <label [attr.for]="id ? id : null">
      <span *ngIf="!chipMode" class="label" [ngClass]="{ required: _isRequired }">{{ label }}</span>
      <div class="watt-field-wrapper">
        <ng-content />
      </div>
      <ng-content select="watt-field-hint" />
      <ng-content select="watt-field-error" />
    </label>
  `,
})
export class WattFieldComponent implements OnChanges {
  @Input() label!: string;
  @Input({ required: true }) control!: FormControl | null;
  @Input() id!: string;
  @Input() chipMode = false;
  @HostBinding('class.watt-field--chip')
  get _chip() {
    return this.chipMode;
  }

  @HostBinding('class.watt-field--invalid')
  get _hasError() {
    return this.control?.status === 'INVALID' && !!this.control?.touched;
  }
  protected _isRequired = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['control']) {
      this._isRequired = this.control?.hasValidator(Validators.required) ?? false;
    }
  }
}
