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
  Component,
  DestroyRef,
  EnvironmentInjector,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RxPush } from '@rx-angular/template/push';
import { Observable, debounceTime, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattRange } from '@energinet-datahub/watt/date';
import { getGridAreaOptionsForPeriod } from '@energinet-datahub/dh/shared/data-access-graphql';
import { EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';

type DhFormType = FormGroup<{
  period: FormControl<WattRange<Date> | null>;
  gridAreas: FormControl<string[] | null>;
}>;

type MeasurementsReportRequestedBy = {
  isFas: boolean;
  actorId: string;
  marketRole: EicFunction;
};

@Component({
  selector: 'dh-request-report-modal',
  imports: [
    RxPush,
    ReactiveFormsModule,
    TranslocoDirective,

    WATT_MODAL,
    VaterStackComponent,
    WattDropdownComponent,
    WattDatepickerComponent,
    WattButtonComponent,
  ],
  styles: `
    :host {
      display: block;
    }

    #request-measurements-report-form {
      margin-top: var(--watt-space-ml);
    }

    .items-group > * {
      width: 85%;
    }
  `,
  templateUrl: './request-report-modal.component.html',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhRequestReportModal extends WattTypedModal<MeasurementsReportRequestedBy> {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly destroyRef = inject(DestroyRef);

  form: DhFormType = this.formBuilder.group({
    period: new FormControl<WattRange<Date> | null>(null, [Validators.required]),
    gridAreas: new FormControl<string[] | null>(null, Validators.required),
  });

  gridAreaOptions$ = this.getGridAreaOptions();

  submitInProgress = signal(false);

  private getGridAreaOptions(): Observable<WattDropdownOptions> {
    const arbitraryDebounceTime = 50;

    return this.form.controls.period.valueChanges.pipe(
      // Needed because the watt-datepicker component
      // emits multiple times when the period changes
      debounceTime(arbitraryDebounceTime),
      takeUntilDestroyed(this.destroyRef),
      tap(() => {
        this.form.controls.gridAreas.setValue(null);
        this.form.controls.gridAreas.markAsPristine();
        this.form.controls.gridAreas.markAsUntouched();
      }),
      switchMap((maybePeriod) => {
        if (maybePeriod == null) {
          return [];
        }

        return runInInjectionContext(this.environmentInjector, () =>
          getGridAreaOptionsForPeriod(maybePeriod, this.modalData.actorId)
        );
      }),
      tap((gridAreaOptions) => {
        if (gridAreaOptions.length === 1) {
          this.form.controls.gridAreas.setValue([gridAreaOptions[0].value]);
        }
      })
    );
  }

  submit(): void {
    console.log('submit');
  }
}
