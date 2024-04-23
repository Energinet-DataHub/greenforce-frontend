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
  Input,
  OnInit,
  Output,
  inject,
  Component,
  DestroyRef,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { RxPush } from '@rx-angular/template/push';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattFormChipDirective } from '@energinet-datahub/watt/field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattDateRangeChipComponent } from '@energinet-datahub/watt/datepicker';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { DhOutgoingMessagesFilters } from '@energinet-datahub/dh/esett/data-access-outgoing-messages';

import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';

import {
  DocumentStatus,
  EicFunction,
  ExchangeEventCalculationType,
  TimeSeriesType,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  getActorOptions,
  getGridAreaOptions,
} from '@energinet-datahub/dh/shared/data-access-graphql';

// Map query variables type to object of form controls type
type FormControls<T> = { [P in keyof T]: FormControl<T[P] | null> };
type Filters = FormControls<DhOutgoingMessagesFilters>;

@Component({
  standalone: true,
  selector: 'dh-outgoing-messages-filters',
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

    DhDropdownTranslatorDirective,
  ],
})
export class DhOutgoingMessagesFiltersComponent implements OnInit {
  private destoryRef = inject(DestroyRef);

  @Input() initial?: DhOutgoingMessagesFilters;

  @Output() filter = new EventEmitter<DhOutgoingMessagesFilters>();
  @Output() formReset = new EventEmitter<void>();

  calculationTypeOptions = dhEnumToWattDropdownOptions(ExchangeEventCalculationType);
  messageTypeOptions = dhEnumToWattDropdownOptions(TimeSeriesType);
  gridAreaOptions$ = getGridAreaOptions();
  energySupplierOptions$ = getActorOptions([EicFunction.EnergySupplier]);
  documentStatusOptions = dhEnumToWattDropdownOptions(DocumentStatus);

  formGroup!: FormGroup<Filters>;

  ngOnInit(): void {
    this.formGroup = new FormGroup<Filters>({
      calculationTypes: dhMakeFormControl(this.initial?.calculationTypes),
      messageTypes: dhMakeFormControl(this.initial?.messageTypes),
      gridAreas: dhMakeFormControl(this.initial?.gridAreas),
      actorNumber: dhMakeFormControl(this.initial?.actorNumber),
      status: dhMakeFormControl(this.initial?.status),
      period: dhMakeFormControl(this.initial?.period),
      created: dhMakeFormControl(this.initial?.created),
      latestDispatch: dhMakeFormControl(this.initial?.latestDispatch),
    });

    this.formGroup.valueChanges
      .pipe(debounceTime(500), takeUntilDestroyed(this.destoryRef))
      .subscribe((value) => this.filter.emit(value as DhOutgoingMessagesFilters));
  }
}
