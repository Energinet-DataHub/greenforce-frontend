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
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { getPath } from '@energinet-datahub/dh/core/routing';

import { dhMeteringPointIdValidator } from './dh-metering-point.validator';

@Component({
  selector: 'dh-search',
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    VaterStackComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    WattButtonComponent,
  ],
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    .search-wrapper {
      margin-top: 15rem;
      width: 50%;
    }
  `,
  template: `
    <vater-stack *transloco="let t; read: 'meteringPoint.search'">
      <div class="search-wrapper">
        <watt-text-field
          [formControl]="searchControl"
          [placeholder]="t('placeholder')"
          (keydown.enter)="onSubmit()"
        >
          <watt-button variant="icon" icon="search" (click)="onSubmit()" />

          @if (searchControl.hasError('containsLetters')) {
            <watt-field-error>
              {{ t('error.containsLetters') }}
            </watt-field-error>
          }

          @if (searchControl.hasError('meteringPointIdLength')) {
            <watt-field-error>
              {{ t('error.meteringPointIdLength') }}
            </watt-field-error>
          }
        </watt-text-field>
      </div>
    </vater-stack>
  `,
})
export class DhSearchComponent {
  private router = inject(Router);

  searchControl = new FormControl('', [dhMeteringPointIdValidator()]);

  onSubmit() {
    this.searchControl.markAsTouched();

    if (this.searchControl.invalid) {
      return;
    }

    this.router.navigate(['/', getPath('metering-point'), this.searchControl.value]);
  }
}
