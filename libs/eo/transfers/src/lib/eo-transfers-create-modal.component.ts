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
import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WattInputDirective } from '@energinet-datahub/watt/input';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { EoTransfersService } from './eo-transfers.service';
import { EoTransfersStore } from './eo-transfers.store';
import { WattTimepickerComponent } from '@energinet-datahub/watt/timepicker';
import { EoTransfersTimepickerComponent } from './eo-transfers-timepicker.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-transfers-create-modal',
  imports: [
    WATT_MODAL,
    WATT_FORM_FIELD,
    WattButtonComponent,
    ReactiveFormsModule,
    WattInputDirective,
    WattDatepickerComponent,
    WattTimepickerComponent,
    FormsModule,
    NgIf,
    EoTransfersTimepickerComponent,
  ],
  standalone: true,
  styles: [
    `
      watt-form-field {
        margin-top: var(--watt-space-l);
        margin-bottom: var(--watt-space-m);
      }

      .datetime {
        display: flex;
        gap: var(--watt-space-m);
      }

      /** TODO: should be done in Watt */
      .datetime .mat-form-field-type-mat-date-range-input .mat-form-field-infix {
        width: auto !important;
      }
    `,
  ],
  template: `
    <watt-modal
      #modal
      [title]="title"
      closeLabel="Close modal"
      [loading]="requestLoading"
      (closed)="form.reset()"
    >
      <form [formGroup]="form">
        <watt-form-field>
          <watt-label>Receiver</watt-label>
          <input
            wattInput
            required="true"
            type="text"
            formControlName="tin"
            [maxlength]="8"
            data-testid="new-agreement-receiver-input"
          />
          <watt-error *ngIf="form.controls.tin.errors">
            An 8-digit TIN/CVR number is required
          </watt-error>
        </watt-form-field>
        <fieldset>
          <div class="datetime">
            <watt-form-field class="datepicker">
              <watt-label>Start of period</watt-label>
              <watt-datepicker
                required="true"
                formControlName="startDate"
                [min]="minStartDate"
                [max]="maxStartDate"
                data-testid="new-agreement-daterange-input"
              />
              <watt-error *ngIf="form.controls.startDate.errors">
                A start date is required
              </watt-error>
            </watt-form-field>
            <eo-transfers-timepicker
              formControlName="startDateTime"
              [selectedDate]="form.controls.startDate.value"
            ></eo-transfers-timepicker>
          </div>

          <div class="datetime">
            <watt-form-field class="datepicker">
              <watt-label>End of period</watt-label>
              <watt-datepicker
                required="true"
                formControlName="endDate"
                data-testid="new-agreement-daterange-input"
                [min]="minEndDate"
              />
              <watt-error *ngIf="form.controls.endDate.errors">
                An end date is required
              </watt-error>
            </watt-form-field>
            <eo-transfers-timepicker
              formControlName="endDateTime"
              [selectedDate]="form.controls.endDate.value"
              [disabledHours]="
                form.controls.startDateTime.value ? [form.controls.startDateTime.value] : []
              "
            >
            </eo-transfers-timepicker>
          </div>
        </fieldset>
      </form>
      <watt-modal-actions>
        <watt-button
          variant="secondary"
          data-testid="close-new-agreement-button"
          (click)="modal.close(false)"
        >
          Cancel
        </watt-button>
        <watt-button
          data-testid="create-new-agreement-button"
          [disabled]="!form.valid"
          (click)="createAgreement()"
        >
          Create
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class EoTransfersCreateModalComponent implements OnInit, OnDestroy {
  @ViewChild(WattModalComponent) modal!: WattModalComponent;
  @Input() title = '';

  form = new FormGroup({
    tin: new FormControl('', [Validators.minLength(8), Validators.pattern('^[0-9]*$')]),
    startDate: new FormControl('', [Validators.required]),
    startDateTime: new FormControl(''),
    endDate: new FormControl('', [Validators.required]),
    endDateTime: new FormControl(''),
  });
  requestLoading = false;

  protected minStartDate: Date = new Date();
  protected maxStartDate?: Date;
  protected minEndDate: Date = new Date();

  private destroy$ = new Subject<void>();

  constructor(
    private service: EoTransfersService,
    private store: EoTransfersStore,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.form.controls.startDate.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((startDate) => {
        this.minEndDate = startDate ? new Date(startDate) : new Date();
      });

    this.form.controls.endDate.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((endDate) => {
      this.maxStartDate = endDate ? new Date(endDate) : undefined;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  open() {
    this.modal.open();
  }

  createAgreement() {
    console.log(this.form.valid);
    if (!this.form.valid) return;

    /*
    const transfer = {
      startDate: getUnixTime(zonedTimeToUtc(this.form.controls['dateRange'].value.start, 'utc')),
      endDate: getUnixTime(zonedTimeToUtc(this.form.controls['dateRange'].value.end, 'utc')),
      receiverTin: this.form.controls['tin'].value as string,
    };

    this.requestLoading = true;
    this.service.createAgreement(transfer).subscribe({
      next: (transfer) => {
        this.store.addTransfer(transfer);
        this.requestLoading = false;
        this.cd.detectChanges();
        this.modal.close(true);
      },
      error: () => {
        this.requestLoading = false;
        this.cd.detectChanges();
      },
    });*/
  }
}
