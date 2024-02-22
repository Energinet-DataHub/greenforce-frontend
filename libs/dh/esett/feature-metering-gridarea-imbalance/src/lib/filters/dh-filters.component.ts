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
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { Observable, Subscription, debounceTime, map } from 'rxjs';
import { RxPush } from '@rx-angular/template/push';
import { Apollo } from 'apollo-angular';

import { WattFormChipDirective } from '@energinet-datahub/watt/field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattDateRangeChipComponent } from '@energinet-datahub/watt/datepicker';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';
import {
  GetGridAreasDocument,
  MeteringGridImbalanceValuesToInclude,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { exists } from '@energinet-datahub/dh/shared/util-operators';

import { DhMeteringGridAreaImbalanceFilters } from '../dh-metering-gridarea-imbalance-filters';

// Map query variables type to object of form controls type
type FormControls<T> = { [P in keyof T]: FormControl<T[P] | null> };
type Filters = FormControls<DhMeteringGridAreaImbalanceFilters>;

@Component({
  standalone: true,
  selector: 'dh-metering-gridarea-imbalance-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-filters.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      form {
        overflow-y: hidden;
      }

      watt-dropdown {
        width: auto;
      }
    `,
  ],
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    RxPush,

    VaterSpacerComponent,
    VaterStackComponent,
    WattButtonComponent,
    WattDateRangeChipComponent,
    WattFormChipDirective,
    WattDropdownComponent,
  ],
})
export class DhMeteringGridAreaImbalanceFiltersComponent implements OnInit, OnDestroy {
  private apollo = inject(Apollo);
  private subscription: Subscription | null = null;
  private transloco = inject(TranslocoService);

  @Input() initial?: DhMeteringGridAreaImbalanceFilters;

  @Output() filter = new EventEmitter<DhMeteringGridAreaImbalanceFilters>();
  @Output() formReset = new EventEmitter<void>();

  gridAreaOptions$ = this.getGridAreaOptions();
  valuestoIncludeOptions$ = this.getValuesToIncludeOptions();

  formGroup!: FormGroup<Filters>;

  ngOnInit(): void {
    this.formGroup = new FormGroup<Filters>({
      gridArea: dhMakeFormControl(this.initial?.gridArea),
      period: dhMakeFormControl(this.initial?.period),
      valuesToInclude: dhMakeFormControl(this.initial?.valuesToInclude),
    });

    this.subscription = this.formGroup.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => this.filter.emit(value as DhMeteringGridAreaImbalanceFilters));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.subscription = null;
  }

  private getGridAreaOptions(): Observable<WattDropdownOptions> {
    return this.apollo.watchQuery({ query: GetGridAreasDocument }).valueChanges.pipe(
      map((result) => result.data?.gridAreas),
      exists(),
      map((gridAreas) =>
        gridAreas.map((gridArea) => ({
          value: gridArea.code,
          displayValue: `${gridArea.name} (${gridArea.code})`,
        }))
      )
    );
  }

  private getValuesToIncludeOptions(): Observable<WattDropdownOptions> {
    return this.transloco
      .selectTranslateObject('eSett.meteringGridAreaImbalance.shared.valuesToInclude')
      .pipe(
        map((translationObject) =>
          Object.values(MeteringGridImbalanceValuesToInclude).map((status) => ({
            displayValue: translationObject[status],
            value: status,
          }))
        )
      );
  }
}
