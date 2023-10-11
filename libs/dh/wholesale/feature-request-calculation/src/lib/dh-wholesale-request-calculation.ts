import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MeteringPointType, EdiB2CProcessType } from '@energinet-datahub/dh/shared/domain/graphql';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { VaterStackComponent, VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective } from '@ngneat/transloco';
import {
  DhDropdownTranslatorDirective,
  enumToDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { Apollo } from 'apollo-angular';
import { graphql } from '@energinet-datahub/dh/shared/domain';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'dh-wholesale-request-calculation',
  templateUrl: './dh-wholesale-request-calculation.html',
  standalone: true,
  styles: [
    `
      :host {
        display: block;

        watt-dropdown {
          width: 50%;
        }
      }
    `,
  ],
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
  private apollo = inject(Apollo);
  private fb = inject(NonNullableFormBuilder);

  form = this.fb.group({
    processType: ['', Validators.required],
    period: ['', Validators.required],
    gridarea: ['', Validators.required],
    meteringPointType: ['', Validators.required],
  });

  gridAreaOptions: WattDropdownOptions = [];
  meteringPointOptions = enumToDropdownOptions(MeteringPointType);
  progressTypeOptions = enumToDropdownOptions(EdiB2CProcessType);

  selectedActorQuery = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetSelectedActorDocument,
  });

  constructor() {
    // @ts-ignore
    // console.log(this.form.controls.gridarea._rawValidators);
    this.selectedActorQuery.valueChanges.pipe(takeUntilDestroyed()).subscribe({
      next: (result) => {
        if (result.loading === false) {
          this.gridAreaOptions = result.data.selectedActor.gridAreas.map((gridArea) => ({
            displayValue: `${gridArea.name} - ${gridArea.name}`,
            value: gridArea.code,
          }));
        }
      },
      error: (error) => {
        // console.log(error);
      },
    });
  }
}
