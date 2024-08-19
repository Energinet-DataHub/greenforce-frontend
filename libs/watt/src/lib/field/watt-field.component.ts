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
import { filter, startWith, switchMap, tap } from 'rxjs/operators';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { WattTooltipDirective } from '@energinet-datahub/watt/tooltip';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattRangeValidators } from '@energinet-datahub/watt/utils/validators';

import { WattFieldIntlService } from './watt-field-intl.service';
import { WattFieldErrorComponent } from './watt-field-error.component';

@Component({
  selector: 'watt-field',
  standalone: true,
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
        <div class="watt-field-wrapper" #wrapper>
          <ng-content />
        </div>
        <ng-content select="watt-field-descriptor" />
      </vater-stack>
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
  },
})
export class WattFieldComponent {
  intl = inject(WattFieldIntlService);

  control = input<FormControl | null>(null);
  label = input<string>();
  id = input<string>();
  chipMode = input(false);
  tooltip = input<string>();

  unlabelled = computed(() => !this.label());

  errors = signal<ValidationErrors | null>(null);
  isRequired = signal(false);
  isEmpty = computed(() => this.errors()?.['required'] || this.errors()?.['rangeRequired']);

  // Used for text fields with autocomplete
  wrapper = viewChild.required<ElementRef>('wrapper');

  constructor() {
    const status$ = toObservable(this.control).pipe(
      filter((control) => control !== null),
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
    status$.subscribe();
  }

  isRequiredControl(control: FormControl) {
    const validators = [Validators.required, WattRangeValidators.required];
    return validators.some((validator) => control.hasValidator(validator));
  }
}
