import {
  Component,
  NgModule,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
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
import {
  DatePickerData,
  DrawerDatepickerService,
} from './drawer-datepicker.service';

@Component({
  selector: 'dh-drawer-datepicker',
  templateUrl: './dh-drawer-datepicker.component.html',
  styleUrls: ['./dh-drawer-datepicker.component.scss'],
})
export class DhDrawerDatepickerComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Output() changed = new EventEmitter();

  private readonly chipOptions: WattChipsOption[] = [
    { label: 'day', value: 'd' },
    { label: 'week', value: 'w' },
    { label: 'month', value: 'm' },
    { label: 'quarter', value: 'q' },
    { label: 'year', value: 'y' },
  ];

  options = this.chipOptions;
  data: DatePickerData = this.datepickerService.getData();
  optionSelected: WattChipsSelection = '';
  startDate = this.data.startDate;
  endDate = this.data.endDate;
  timer: NodeJS.Timeout | undefined;

  formControlDateRange = new FormControl<{ start: string; end: string }>(
    { start: this.startDate, end: this.endDate },
    [WattRangeValidators.required()]
  );

  constructor(
    private translocoService: TranslocoService,
    private datepickerService: DrawerDatepickerService
  ) {}

  private destroy$ = new Subject<void>();

  ngAfterViewInit() {
    this.formControlDateRange.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((dateRange) => {
        this.datepickerService.setData({
          endDate: dateRange?.end ?? '',
          startDate: dateRange?.start ?? '',
        });

        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          if (dateRange?.end != '') this.changed.emit(dateRange);
        }, 1000);
      });
  }

  ngOnInit(): void {
    this.setupDateChipTranslation();

    this.datepickerService.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        const value = this.formControlDateRange.value;
        if (data.endDate == null) return;
        if (value?.start == data.startDate && value?.end == data.endDate)
          return;

        this.formControlDateRange.patchValue(
          {
            start:
              value?.start == data.startDate ? value.start : data.startDate,
            end: value?.end == data.endDate ? value.end : data.endDate,
          },
          {
            emitEvent: false,
          }
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  private setupDateChipTranslation() {
    this.translocoService
      .selectTranslateObject('charges.prices.drawer.dateChips')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (translationKeys) => {
          this.options = Object.values(
            this.chipOptions.map((option) => {
              return {
                label: translationKeys[option.label],
                value: option.value,
              };
            })
          );
        },
      });
  }
  selectionChange(selectedChip: WattChipsSelection) {
    console.log(selectedChip);
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
    WattChipsModule,
  ],
})
export class DhDrawerDatepickerScam {}
