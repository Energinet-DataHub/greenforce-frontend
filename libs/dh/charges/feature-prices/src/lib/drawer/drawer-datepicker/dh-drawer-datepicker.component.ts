import { Component, NgModule, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import {
  WattFormFieldModule,
  WattDatepickerModule,
  WattRangeValidators,
  WattChipsModule,
  WattChipsSelection,
  WattChipsOption,
} from '@energinet-datahub/watt';


@Component({
  selector: 'dh-drawer-datepicker',
  templateUrl: './dh-drawer-datepicker.component.html',
  styleUrls: ['./dh-drawer-datepicker.component.scss']
})
export class DhDrawerDatepickerComponent implements OnInit {
  optionSelected : WattChipsSelection = "d";

  private readonly chipOptions : WattChipsOption[] = [
    { label: 'day', value: "d" },
    { label: 'week', value: "w" },
    { label: 'month', value: "m" },
    { label: 'quarter', value: "q" },
    { label: 'year', value: "y" },
  ];

  options = this.chipOptions;

  formControlDateRange = new FormControl<{ start: string; end: string }>(
    {
      start: new Date().toISOString(),
      end: new Date().toISOString(),
    },
    [WattRangeValidators.required()]
  );

  private destroy$ = new Subject<void>();

  constructor(private translocoService: TranslocoService) {
  }

  ngOnInit(): void {
    this.setupDateChipTranslation();
  }

  private setupDateChipTranslation() {
      this.translocoService
        .selectTranslateObject('charges.prices.drawer.dateChips')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (translationKeys) => {
            this.options = Object.values(this.chipOptions
              .map((option) => {
                return {
                  label: translationKeys[option.label],
                  value: option.value
                };
              }));
          },
        });
  }

  //selectionChange(selectedChip: WattChipsSelection) {}
}

@NgModule({
  declarations: [DhDrawerDatepickerComponent],
  exports: [DhDrawerDatepickerComponent],
  imports: [
    TranslocoModule,
    CommonModule,
    ReactiveFormsModule,
    WattFormFieldModule,
    WattDatepickerModule,
    WattChipsModule
  ],
})
export class DhDrawerDatepickerScam {}
