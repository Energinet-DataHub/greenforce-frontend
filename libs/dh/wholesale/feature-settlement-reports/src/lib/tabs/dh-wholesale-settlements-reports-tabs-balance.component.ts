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
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WholesaleProcessType, graphql } from '@energinet-datahub/dh/shared/domain';
import { Subject, takeUntil } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { ActorFilter } from '@energinet-datahub/dh/wholesale/domain';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhWholesaleSettlementReportsDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { WattToastService } from '@energinet-datahub/watt/toast';

@Component({
  standalone: true,
  selector: 'dh-wholesale-settlements-reports-tabs-balance',
  templateUrl: './dh-wholesale-settlements-reports-tabs-balance.component.html',
  styleUrls: ['./dh-wholesale-settlements-reports-tabs-balance.component.scss'],
  imports: [
    WATT_TABS,
    WATT_CARD,
    TranslocoModule,
    WattButtonComponent,
    WattDatepickerComponent,
    ReactiveFormsModule,
    WATT_FORM_FIELD,
    WattDropdownComponent,
    DhPermissionRequiredDirective,
  ],
})
export class DhWholesaleSettlementsReportsTabsBalanceComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private apollo = inject(Apollo);
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);
  private destroy$ = new Subject<void>();
  private readonly settlementReportStore = inject(DhWholesaleSettlementReportsDataAccessApiStore);

  @Input() set executionTime(executionTime: { start: string; end: string }) {
    this.searchForm.patchValue({ executionTime });
  }
  searchForm = this.fb.group({
    executionTime: [this.executionTime, WattRangeValidators.required()],
    actor: [''],
    gridAreas: [[] as string[], Validators.required],
  });

  actors!: ActorFilter;
  gridAreas!: WattDropdownOption[];

  actorsQuery = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetActorsForSettlementReportDocument,
    variables: {
      eicFunctions: [graphql.EicFunction.GridAccessProvider, graphql.EicFunction.EnergySupplier],
    },
  });

  gridAreasQuery = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetGridAreasDocument,
  });

  ngOnInit(): void {
    this.actorsQuery.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        this.actors = result.data?.actors ?? [];
        if (!result.loading) this.searchForm.controls.actor.enable();
      },
    });

    this.gridAreasQuery.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        this.gridAreas = (result.data?.gridAreas ?? []).map((g) => ({
          displayValue: `${g.name} (${g.code})`,
          value: g.code,
        }));
        if (!result.loading) this.searchForm.controls.gridAreas.enable();
      },
    });
  }

  downloadClicked() {
    this.toastService.open({
      type: 'loading',
      message: this.transloco.translate('wholesale.settlementReports.downloadStart'),
    });
    this.settlementReportStore.download(
      this.searchForm.controls.gridAreas?.value ?? [],
      WholesaleProcessType.BalanceFixing,
      this.searchForm.controls.executionTime.value?.start ?? '',
      this.searchForm.controls.executionTime.value?.end ?? '',
      this.searchForm.controls.actor.value ?? undefined,
      this.transloco.translate('selectedLanguageIso'),
      () => {
        this.toastService.open({
          type: 'danger',
          message: this.transloco.translate('wholesale.settlementReports.downloadFailed'),
        });
      },
      () => {
        this.toastService.dismiss();
      }
    );
  }
}
