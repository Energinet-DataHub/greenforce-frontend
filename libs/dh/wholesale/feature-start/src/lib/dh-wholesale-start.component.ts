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
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  combineLatest,
  first,
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LetModule, PushModule } from '@rx-angular/template';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import isAfter from 'date-fns/isAfter';
import isEqual from 'date-fns/isEqual';

import {
  WattDropdownModule,
  WattDropdownOption,
} from '@energinet-datahub/watt/dropdown';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattDatepickerModule } from '@energinet-datahub/watt/datepicker';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';
import { CommonModule } from '@angular/common';
import { GridAreaDto } from '@energinet-datahub/dh/shared/domain';

interface DateRange {
  start: string;
  end: string;
}

interface CreateBatchFormValues {
  gridAreas: FormControl<string[] | null>;
  dateRange: FormControl<DateRange | null>;
}

@Component({
  selector: 'dh-wholesale-start',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-wholesale-start.component.html',
  styleUrls: ['./dh-wholesale-start.component.scss'],
  providers: [DhWholesaleBatchDataAccessApiStore],
  standalone: true,
  imports: [
    CommonModule,
    DhFeatureFlagDirectiveModule,
    LetModule,
    PushModule,
    ReactiveFormsModule,
    TranslocoModule,
    WattButtonModule,
    WattDatepickerModule,
    WattDropdownModule,
    WattFormFieldModule,
    WattSpinnerModule,
    WattEmptyStateModule,
  ],
})
export class DhWholesaleStartComponent implements OnInit, OnDestroy {
  private store = inject(DhWholesaleBatchDataAccessApiStore);
  private toast = inject(WattToastService);
  private transloco = inject(TranslocoService);
  private router = inject(Router);

  private destroy$ = new Subject<void>();

  loadingCreatingBatch$ = this.store.loadingCreatingBatch$;
  loadingGridAreasErrorTrigger$ = this.store.loadingGridAreasErrorTrigger$;

  createBatchForm = new FormGroup<CreateBatchFormValues>({
    gridAreas: new FormControl(null, { validators: Validators.required }),
    dateRange: new FormControl(null, {
      validators: WattRangeValidators.required(),
    }),
  });

  onDateRangeChange$ =
    this.createBatchForm.controls.dateRange.valueChanges.pipe(startWith(null));

  gridAreas$: Observable<WattDropdownOption[]> = combineLatest([
    this.store.gridAreas$,
    this.onDateRangeChange$,
  ]).pipe(
    map(([gridAreas, dateRange]) => this.filterValidGridAreas(gridAreas || [], dateRange)),
    map((gridAreas) => this.mapGridAreasToDropdownOptions(gridAreas))
  );

  ngOnInit(): void {
    this.store.getGridAreas();
    this.toggleGridAreasControl();
    this.initCreatingBatchListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createBatch() {
    const { gridAreas, dateRange } = this.createBatchForm.getRawValue();
    if (
      this.createBatchForm.invalid ||
      gridAreas === null ||
      dateRange === null
    )
      return;

    this.store.createBatch({ gridAreas, dateRange });

    this.toast.open({
      type: 'loading',
      message: this.transloco.translate('wholesale.startBatch.creatingBatch'),
    });
  }

  private mapGridAreasToDropdownOptions(gridAreas: GridAreaDto[]): WattDropdownOption[] {
    return gridAreas?.map((gridArea) => {
      return {
        displayValue: `${gridArea?.name} (${gridArea?.code})`,
        value: gridArea?.code,
      };
    }) || []
  }

  private filterValidGridAreas(
    gridAreas: GridAreaDto[],
    dateRange: DateRange | null
  ): GridAreaDto[] {
    if (dateRange === null) return gridAreas;
    return gridAreas?.filter((gridArea) => {
      return (
        isAfter(new Date(gridArea.validFrom), new Date(dateRange.start)) ||
        isEqual(new Date(dateRange.start), new Date(gridArea.validFrom))
      );
    });
  }

  private toggleGridAreasControl() {
    // Disable grid areas when date range is invalid
    this.onDateRangeChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const gridAreasControl = this.createBatchForm.controls.gridAreas;
        const disableGridAreas =
          this.createBatchForm.controls.dateRange.invalid;

        disableGridAreas
          ? gridAreasControl.disable()
          : gridAreasControl.enable();
      });
  }

  private initCreatingBatchListeners() {
    // Close toast on navigation
    this.router.events
      .pipe(first((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.toast.dismiss();
      });

    this.store.creatingBatchSuccessTrigger$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onBatchCreatedSuccess());

    this.store.creatingBatchErrorTrigger$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onBatchCreatedError());
  }

  private onBatchCreatedSuccess() {
    this.toast.update({
      type: 'success',
      message: this.transloco.translate(
        'wholesale.startBatch.creatingBatchSuccess'
      ),
    });
  }

  private onBatchCreatedError() {
    this.toast.update({
      type: 'danger',
      message: this.transloco.translate(
        'wholesale.startBatch.creatingBatchError'
      ),
    });
  }
}
