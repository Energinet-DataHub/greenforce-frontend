import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  input,
  output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';
import { debounceTime } from 'rxjs';
import { RxPush } from '@rx-angular/template/push';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattFormChipDirective } from '@energinet-datahub/watt/field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattDateRangeChipComponent } from '@energinet-datahub/watt/datepicker';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import {
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { MeteringGridImbalanceValuesToInclude } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhDropdownTranslatorDirective } from '@energinet-datahub/dh/shared/ui-util';
import { getGridAreaOptions } from '@energinet-datahub/dh/shared/data-access-graphql';
import { WattQueryParamsDirective } from '@energinet-datahub/watt/directives';

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
    WattQueryParamsDirective,

    DhDropdownTranslatorDirective,
  ],
})
export class DhMeteringGridAreaImbalanceFiltersComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  initial = input.required<DhMeteringGridAreaImbalanceFilters>();
  filter = output<DhMeteringGridAreaImbalanceFilters>();
  formReset = output<void>();

  gridAreaOptions$ = getGridAreaOptions();
  valuestoIncludeOptions: WattDropdownOptions = dhEnumToWattDropdownOptions(
    MeteringGridImbalanceValuesToInclude
  );

  formGroup!: FormGroup<Filters>;

  ngOnInit(): void {
    this.formGroup = new FormGroup<Filters>({
      gridAreas: dhMakeFormControl(this.initial().gridAreas),
      valuesToInclude: dhMakeFormControl(this.initial().valuesToInclude),
      created: dhMakeFormControl(this.initial().created),
      calculationPeriod: dhMakeFormControl(this.initial().calculationPeriod),
    });

    this.formGroup.valueChanges
      .pipe(debounceTime(500), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.filter.emit(value as DhMeteringGridAreaImbalanceFilters));
  }
}
