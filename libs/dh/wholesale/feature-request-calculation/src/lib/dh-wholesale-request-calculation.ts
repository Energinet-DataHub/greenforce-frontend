import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MeteringPointType, EdiB2CProcessType } from '@energinet-datahub/dh/shared/domain/graphql';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { VaterStackComponent, VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective } from '@ngneat/transloco';
import {
  DhDropdownTranslatorDirective,
  enumToDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-wholesale-request-calculation',
  templateUrl: './dh-wholesale-request-calculation.html',
  standalone: true,
  imports: [
    WATT_CARD,
    WattDropdownComponent,
    DhDropdownTranslatorDirective,
    VaterStackComponent,
    VaterFlexComponent,
    ReactiveFormsModule,
    FormsModule,
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

  meteringPointTypes = enumToDropdownOptions(MeteringPointType);
  progressTypeOptions = enumToDropdownOptions(EdiB2CProcessType);
}
