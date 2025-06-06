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
  computed,
  DestroyRef,
  EnvironmentInjector,
  inject,
  runInInjectionContext,
  viewChild,
} from '@angular/core';
import { translate, TranslocoDirective } from '@jsverse/transloco';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MutationResult } from 'apollo-angular';
import { RxPush } from '@rx-angular/template/push';
import { debounceTime, Observable, switchMap, tap } from 'rxjs';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattRange } from '@energinet-datahub/watt/date';
import { getGridAreaOptionsForPeriod } from '@energinet-datahub/dh/shared/data-access-graphql';
import {
  EicFunction,
  GetMeasurementsReportsDocument,
  MarketRole,
  RequestMeasurementsReportDocument,
  RequestMeasurementsReportMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattFieldErrorComponent, WattFieldHintComponent } from '@energinet-datahub/watt/field';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';

import { startDateAndEndDateHaveSameMonthValidator } from '../util/start-date-and-end-date-have-same-month.validator';

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
    ReactiveFormsModule,
    TranslocoDirective,
    RxPush,

    WATT_MODAL,
    VaterStackComponent,
    WattDropdownComponent,
    WattDatepickerComponent,
    WattButtonComponent,
    WattFieldErrorComponent,
    WattFieldHintComponent,
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

  private readonly toastService = inject(WattToastService);

  private readonly requestReportMutation = mutation(RequestMeasurementsReportDocument);

  private modal = viewChild.required(WattModalComponent);

  form: DhFormType = this.formBuilder.group({
    period: new FormControl<WattRange<Date> | null>(null, [
      Validators.required,
      startDateAndEndDateHaveSameMonthValidator(),
    ]),
    gridAreas: new FormControl<string[] | null>(null, Validators.required),
  });

  private gridAreaChanges = toSignal(this.form.controls.gridAreas.valueChanges);

  gridAreaOptions$ = this.getGridAreaOptions();

  multipleGridAreasSelected = computed(() => {
    const gridAreas = this.gridAreaChanges();

    if (gridAreas == null) {
      return false;
    }

    return gridAreas.length > 1;
  });

  submitInProgress = this.requestReportMutation.loading;

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async submit() {
    if (this.form.invalid || this.submitInProgress()) {
      return;
    }

    const { period, gridAreas } = this.form.getRawValue();

    if (period == null || gridAreas == null) {
      return;
    }

    const result = await this.requestReportMutation.mutate({
      variables: {
        input: {
          period: {
            start: period.start,
            end: period.end ? period.end : null,
          },
          gridAreaCodes: gridAreas,
          requestAsActorId: this.modalData.actorId,
          requestAsMarketRole: this.mapMarketRole(this.modalData.marketRole),
        },
      },
      refetchQueries: ({ data }) => {
        if (this.isUpdateSuccessful(data)) {
          return [GetMeasurementsReportsDocument];
        }

        return [];
      },
    });

    if (this.isUpdateSuccessful(result.data)) {
      this.modal().close(true);

      this.showSuccessNotification();
    } else {
      this.showErrorNotification();
    }
  }

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

  private isUpdateSuccessful(
    mutationResult: MutationResult<RequestMeasurementsReportMutation>['data']
  ): boolean {
    return !!mutationResult?.requestMeasurementsReport.boolean;
  }

  private showSuccessNotification(): void {
    this.toastService.open({
      message: translate('reports.measurementsReports.requestReportModal.requestSuccess'),
      type: 'success',
    });
  }

  private showErrorNotification(): void {
    this.toastService.open({
      message: translate('reports.measurementsReports.requestReportModal.requestError'),
      type: 'danger',
    });
  }

  private mapMarketRole(marketRole: EicFunction): MarketRole {
    switch (marketRole) {
      case EicFunction.DataHubAdministrator:
        return MarketRole.DataHubAdministrator;
      case EicFunction.GridAccessProvider:
        return MarketRole.GridAccessProvider;
      default:
        return MarketRole.Other;
    }
  }
}
