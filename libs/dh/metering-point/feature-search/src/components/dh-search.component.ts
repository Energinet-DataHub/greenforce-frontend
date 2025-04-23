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
import { Component, effect, inject, input, linkedSignal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

import { combinePaths, getPath } from '@energinet-datahub/dh/core/routing';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { DoesMeteringPointExistDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

import { dhMeteringPointIdValidator } from './dh-metering-point.validator';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

@Component({
  selector: 'dh-search',
  imports: [
    TranslocoPipe,
    TranslocoDirective,
    ReactiveFormsModule,
    DhPermissionRequiredDirective,

    VaterStackComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    WattButtonComponent,
    WattEmptyStateComponent,
    WattSpinnerComponent,
  ],
  styles: `
    .search-wrapper {
      margin: 15rem 0 var(--watt-space-xl);
      width: 50%;
    }

    watt-spinner {
      margin-right: var(--watt-space-m);
    }
  `,
  template: `
    <vater-stack fill="vertical" *transloco="let t; read: 'meteringPoint.search'">
      <div class="search-wrapper watt-space-stack-xl">
        <watt-text-field
          [formControl]="searchControl"
          [placeholder]="t('placeholder')"
          (keydown.enter)="onSubmit()"
        >
          @if (loading()) {
            <watt-spinner [diameter]="22" />
          } @else {
            <watt-button variant="icon" icon="search" (click)="onSubmit()" />
          }

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

      @if (meteringPointNotFound()) {
        <watt-empty-state size="small" icon="custom-no-results" [title]="t('noResultFound')" />
      }

      @if (hasError() && !meteringPointNotFound()) {
        <watt-empty-state
          icon="custom-power"
          [title]="'shared.error.title' | transloco"
          [message]="'shared.error.message' | transloco"
        />
        <watt-button *dhPermissionRequired="['fas']" variant="text" (click)="navigateToDebug()"
          >debug her</watt-button
        >
      }
    </vater-stack>
  `,
})
export class DhSearchComponent {
  private router = inject(Router);
  private doesMeteringPointExist = lazyQuery(DoesMeteringPointExistDocument);

  searchControl = new FormControl('', {
    validators: [Validators.required, dhMeteringPointIdValidator()],
    nonNullable: true,
  });

  private seachControlChange = toSignal(this.searchControl.valueChanges);

  meteringPointId = input<string>();

  meteringPointNotFound = linkedSignal(() => this.seachControlChange() === this.meteringPointId());
  hasError = linkedSignal(() => this.seachControlChange() === this.meteringPointId());
  loading = this.doesMeteringPointExist.loading;

  constructor() {
    effect(() => {
      const maybeMeteringPointId = this.meteringPointId();

      if (maybeMeteringPointId) {
        this.searchControl.setValue(maybeMeteringPointId);
        this.searchControl.markAsTouched();
      } else {
        this.searchControl.reset();
      }
    });
  }

  navigateToDebug() {
    const meteringPointId = this.searchControl.getRawValue();
    this.router.navigate([combinePaths('metering-point-debug', 'metering-point'), meteringPointId]);
  }

  async onSubmit() {
    this.searchControl.markAsTouched();

    if (this.searchControl.invalid) return;

    const meteringPointId = this.searchControl.getRawValue();
    const result = await this.doesMeteringPointExist.query({ variables: { meteringPointId } });

    const message =
      (result.error?.graphQLErrors[0]?.extensions?.message as string | undefined) ?? '';

    const notFound = message.match('Status: 404') !== null;

    if (notFound) {
      return this.meteringPointNotFound.set(true);
    }

    if (!result.data) {
      return this.hasError.set(true);
    }

    this.router.navigate(['/', getPath('metering-point'), meteringPointId]);
  }
}
