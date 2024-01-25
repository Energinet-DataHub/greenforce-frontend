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
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { ControlContainer, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { WattIconComponent } from '../../foundations/icon/icon.component';
import { WattTooltipDirective } from '../tooltip';
import { WattFieldErrorComponent } from './watt-field-error.component';
import { WattFieldIntlService } from './watt-field-intl.service';

@Component({
  selector: 'watt-field',
  standalone: true,
  imports: [NgIf, NgClass, WattIconComponent, WattTooltipDirective, WattFieldErrorComponent],
  encapsulation: ViewEncapsulation.None,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  styleUrls: ['./watt-field.component.scss'],
  template: `
    <label [attr.for]="id ? id : null">
      <span *ngIf="!chipMode" class="label" [ngClass]="{ required: _isRequired }">
        {{ label }}
        <watt-icon name="info" *ngIf="tooltip" wattTooltipPosition="top" [wattTooltip]="tooltip" />
      </span>
      <div style="display: flex;align-items: center; gap: var(--watt-space-s);">
        <div class="watt-field-wrapper" #wrapper>
          <ng-content />
        </div>
        <ng-content select="watt-field-descriptor" />
      </div>
      <ng-content select="watt-field-hint" />
      <ng-content select="watt-field-error" />
      <watt-field-error
        *ngIf="control?.errors?.['required'] || control?.errors?.['rangeRequired']"
        >{{ intl.required }}</watt-field-error
      >
    </label>
  `,
})
export class WattFieldComponent implements OnChanges {
  private _formGroupDirective = inject(FormGroupDirective, { optional: true });
  intl = inject(WattFieldIntlService);

  @Input() label!: string;
  @Input({ required: true }) control!: FormControl | null;
  @Input() id!: string;
  @Input() chipMode = false;
  @Input() tooltip?: string;

  // Used for text fields with autocomplete
  @ViewChild('wrapper', { static: true }) wrapper!: ElementRef<HTMLDivElement>;

  @HostBinding('class.watt-field--chip')
  get _chip() {
    return this.chipMode;
  }

  @HostBinding('class.watt-field--invalid')
  get _hasError() {
    return (
      (this.control?.status === 'INVALID' && !!this.control?.touched) ||
      (this._formGroupDirective?.submitted && this.control?.status === 'INVALID')
    );
  }
  protected _isRequired = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['control']) {
      this._isRequired = this.control?.hasValidator(Validators.required) ?? false;
    }
  }
}
