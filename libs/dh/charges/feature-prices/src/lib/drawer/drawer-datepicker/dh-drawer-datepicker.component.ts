import { Component, NgModule, OnInit, OnDestroy } from '@angular/core';
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
import { DatePickerData, DrawerDatepickerService } from './drawer-datepicker.service';

@Component({
  selector: 'dh-drawer-datepicker',
  templateUrl: './dh-drawer-datepicker.component.html',
  styleUrls: ['./dh-drawer-datepicker.component.scss']
})
export class DhDrawerDatepickerComponent implements OnInit, OnDestroy {

  private readonly chipOptions : WattChipsOption[] = [
    { label: 'day', value: "d" },
    { label: 'week', value: "w" },
    { label: 'month', value: "m" },
    { label: 'quarter', value: "q" },
    { label: 'year', value: "y" },
  ];

  options = this.chipOptions;
  data : DatePickerData = this.datepickerService.getData();
  optionSelected : WattChipsSelection = this.data.chipOption;
  startDate = this.data.startDate;
  endDate = this.data.endDate;

  formControlDateRange = new FormControl<{ start: string; end: string }>(
    {start: this.startDate, end: this.endDate},
    [WattRangeValidators.required()]
  );

  subscription = this.datepickerService.data$.subscribe(data => { this.startDate = data.startDate, this.endDate = data.endDate, this.optionSelected = data.chipOption });

  constructor(private translocoService: TranslocoService, private datepickerService: DrawerDatepickerService) {}

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
     this.setupDateChipTranslation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.subscription.unsubscribe();
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

  setData() {
    this.datepickerService.setData({ startDate: this.startDate, endDate: this.endDate, chipOption: this.optionSelected as string})
  }

  // how to get notifications on changes from a watt-datepicker?
  datesChange(dates: { start: string, end: string }) {
    this.startDate = dates.start
    this.endDate = dates.end;
    this.setData();

  }

  selectionChange(selectedChip: WattChipsSelection) {
    this.optionSelected = selectedChip;
    this.setData()
  }
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
