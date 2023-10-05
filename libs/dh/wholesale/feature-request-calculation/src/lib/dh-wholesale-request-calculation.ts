import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  selector: 'dh-wholesale-request-calculation',
  templateUrl: './dh-wholesale-request-calculation.html',
  standalone: true,
  imports: [
    WATT_CARD,
    WattDropdownComponent,
    VaterStackComponent,
    ReactiveFormsModule,
    FormsModule,
    TranslocoDirective,
  ],
})
export class DhWholesaleRequestCalculationComponent {
  form = new FormGroup({
    processType: new FormControl(''),
  });

  progressTypeOptions: WattDropdownOptions = [
    { value: '1', displayValue: 'Process type 1' },
    { value: '2', displayValue: 'Process type 2' },
    { value: '3', displayValue: 'Process type 3' },
  ];
}
