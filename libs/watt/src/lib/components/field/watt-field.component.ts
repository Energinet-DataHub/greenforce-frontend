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
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, ValidationErrors, Validators } from '@angular/forms';
import { filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { WattTooltipDirective } from '../tooltip';
import { WattFieldIntlService } from './watt-field-intl.service';
import { WattFieldErrorComponent } from './watt-field-error.component';
import { WattIconComponent } from '../../foundations/icon/icon.component';
import { WattRangeValidators } from '../picker/shared/validators/watt-range.validators';
import { VaterStackComponent } from '../vater/vater-stack.component';

@Component({
    selector: 'watt-field',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [WattIconComponent, WattTooltipDirective, WattFieldErrorComponent, VaterStackComponent],
    styleUrls: ['./watt-field.component.scss'],
    template: `
    <label [attr.for]="id()">
      @if (label()) {
        <span class="label" [class.required]="isRequired()">
          {{ label() }}
          @if (tooltip(); as tooltip) {
            <watt-icon name="info" wattTooltipPosition="top" [wattTooltip]="tooltip" />
          }
        </span>
      }
      <vater-stack direction="row" gap="s">
        <div
          #wrapper
          class="watt-field-wrapper"
          [class.watt-field--has-placeholder]="!!placeholder()"
          [style.anchor-name]="anchorName()"
        >
          @if (placeholder()) {
            <div class="watt-field-placeholder" aria-hidden="true">
              <span class="watt-field-ghost">{{ ghost() }}</span>
              <span class="watt-field-filler">{{ filler() }}</span>
            </div>
          }
          <ng-content />
        </div>
        <ng-content select="watt-field-descriptor" />
      </vater-stack>
      <ng-content select="[popover]" />
      <ng-content select="watt-field-hint" />
      <ng-content select="watt-field-error" />
      @if (isEmpty()) {
        <watt-field-error>{{ intl.required }}</watt-field-error>
      }
    </label>
  `,
    host: {
        '[class.watt-field--chip]': 'chipMode()',
        '[class.watt-field--unlabelled]': 'unlabelled()',
        '[class.watt-field--disabled]': 'control()?.disabled',
    }
})
export class WattFieldComponent {
  intl = inject(WattFieldIntlService);

  control = input<FormControl | null>(null);
  label = input<string>();
  id = input<string>();
  chipMode = input(false);
  tooltip = input<string>();
  placeholder = input('');
  anchorName = input<string>();

  value = signal('');
  filler = computed(() => this.placeholder().slice(this.value().length));
  ghost = computed(() => this.value().slice(0, this.placeholder().length));

  unlabelled = computed(() => !this.label());

  errors = signal<ValidationErrors | null>(null);
  isRequired = signal(false);
  isEmpty = computed(() => this.errors()?.['required'] || this.errors()?.['rangeRequired']);

  // Used for text fields with autocomplete
  wrapper = viewChild.required<ElementRef>('wrapper');

  constructor() {
    const control$ = toObservable(this.control).pipe(filter((control) => control !== null));

    // Track value in order to update ghost and filler
    const value$ = control$.pipe(
      switchMap((control) =>
        control.valueChanges.pipe(
          startWith(control.value),
          map((value) => (value === null || value === undefined ? '' : value.toString())),
          tap((value) => this.value.set(value))
        )
      ),
      takeUntilDestroyed()
    );

    // Track status in order to update required state and show errors
    const status$ = control$.pipe(
      switchMap((control) =>
        control.statusChanges.pipe(
          startWith(control.status),
          tap(() => this.isRequired.set(this.isRequiredControl(control))),
          tap(() => this.errors.set(control.errors))
        )
      ),
      takeUntilDestroyed()
    );

    // Subscribe for side effects
    value$.subscribe();
    status$.subscribe();
  }

  isRequiredControl(control: FormControl) {
    const validators = [Validators.required, WattRangeValidators.required];
    return validators.some((validator) => control.hasValidator(validator));
  }
}
