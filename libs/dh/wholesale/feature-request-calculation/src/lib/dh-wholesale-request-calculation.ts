import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MeteringPointType, ProcessType } from '@energinet-datahub/dh/shared/domain/graphql';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import {
  WattDropdownComponent,
  WattDropdownOptions,
  WattDropdownTranslateDirective,
} from '@energinet-datahub/watt/dropdown';
import { VaterStackComponent, VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  selector: 'dh-wholesale-request-calculation',
  templateUrl: './dh-wholesale-request-calculation.html',
  standalone: true,
  imports: [
    WATT_CARD,
    WattDropdownComponent,
    WattDropdownTranslateDirective,
    VaterStackComponent,
    VaterFlexComponent,
    ReactiveFormsModule,
    FormsModule,z
    TranslocoDirective,
  ],
})
export class DhWholesaleRequestCalculationComponent {
  form = new FormGroup({
    processType: new FormControl(''),
    period: new FormControl(''),
    gridarea: new FormControl(''),
    meteringPointType: new FormControl(''),
  });

  gridAreaOptions: WattDropdownOptions = [];

  meteringPointTypes: WattDropdownOptions = Object.values(MeteringPointType).map((mp) => ({
    displayValue: mp,
    value: mp,
  }));

  progressTypeOptions: WattDropdownOptions = Object.values(ProcessType).map((mp) => ({
    displayValue: mp,
    value: mp,
  }));
}
