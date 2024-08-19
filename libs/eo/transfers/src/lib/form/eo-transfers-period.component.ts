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
import { Component, Input, OnInit, inject, ViewEncapsulation, DestroyRef } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, FormGroupDirective } from '@angular/forms';
import { add, isAfter } from 'date-fns';
import { CommonModule, NgClass } from '@angular/common';
import { TranslocoPipe } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattDatePipe } from '@energinet-datahub/watt/utils/date';
import { WattRadioComponent } from '@energinet-datahub/watt/radio';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { translations } from '@energinet-datahub/eo/translations';

import { EoTransfersDateTimeComponent } from './eo-transfers-date-time.component';
import { EoTransferFormPeriod } from './eo-transfers-form.component';
import { EoTransferErrorsComponent } from './eo-transfers-errors.component';
import { EoExistingTransferAgreement } from '../existing-transfer-agreement';

interface EoTransfersPeriodForm extends EoTransferFormPeriod {
  hasEndDate: FormControl<boolean>;
}

@Component({
  selector: 'eo-transfers-form-period',
  standalone: true,
  imports: [
    CommonModule,
    EoTransfersDateTimeComponent,
    NgClass,
    ReactiveFormsModule,
    WattDatePipe,
    WattRadioComponent,
    WattFieldErrorComponent,
    EoTransferErrorsComponent,
    TranslocoPipe,
  ],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      eo-transfers-form-period .start-date {
        position: relative;
      }

      eo-transfers-form-period .watt-label {
        width: 100%;
      }

      eo-transfers-form-period .end-date {
        position: relative;

        .radio-buttons-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: var(--watt-space-m);
        }

        watt-form-field .mat-placeholder-required.mat-form-field-required-marker {
          display: none;
        }

        .end-date-label {
          margin-bottom: var(--watt-space-s);
        }

        .end-by-container {
          position: relative;
          watt-radio {
            margin-right: var(--watt-space-m);
          }

          watt-datepicker label > span {
            display: none;
          }
        }

        .end-by-container,
        .end-by-container watt-radio {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
        }
      }

      eo-transfers-form-period .asterisk {
        color: var(--watt-color-primary);
        margin-left: var(--watt-space-s);
      }

      eo-transfers-form-period .has-error {
        --watt-radio-color: var(--watt-color-state-danger);

        p,
        p .asterisk {
          color: var(--watt-color-state-danger);
        }
      }
    `,
  ],
  template: `
    <ng-container [formGroup]="form">
      <!-- Start of period -->
      <fieldset class="start-date" [ngClass]="{ 'has-error': form.controls.startDate.errors }">
        <eo-transfers-datetime
          formControlName="startDate"
          [label]="
            translations.createTransferAgreementProposal.timeframe.startDate.label | transloco
          "
          [min]="minStartDate"
          [existingTransferAgreements]="existingTransferAgreements"
        />

        <eo-transfers-errors
          [showError]="
            (form.controls.startDate.touched || form.controls.startDate.dirty) &&
            !!form.controls.startDate.errors
          "
        >
          <watt-field-error [style.opacity]="form.controls.startDate.errors?.['required'] ? 1 : 0">
            {{
              translations.createTransferAgreementProposal.timeframe.startDate.required | transloco
            }}
          </watt-field-error>
          <watt-field-error
            [style.opacity]="form.controls.startDate.errors?.['nextHourOrLater'] ? 1 : 0"
          >
            {{
              translations.createTransferAgreementProposal.timeframe.startDate.nextHourOrLater
                | transloco
            }}
          </watt-field-error>
          <watt-field-error
            [style.opacity]="form.controls.startDate.errors?.['overlapping']?.start ? 1 : 0"
          >
            @if (form.controls.startDate.errors?.['overlapping']?.start; as error) {
              {{
                translations.createTransferAgreementProposal.timeframe.startDate.overlapping
                  | transloco
                    : {
                        startDate: error.startDate | wattDate: 'long',
                        endDate:
                          (error.endDate | wattDate: 'long') ||
                            translations.createTransferAgreementProposal.timeframe.endDate
                              .noEndDateLabel | transloco,
                      }
              }}
            }
          </watt-field-error>
        </eo-transfers-errors>
      </fieldset>

      <!-- End of period -->
      <fieldset
        class="end-date"
        [ngClass]="{ 'has-error': form.controls.endDate.errors || form.controls.hasEndDate.errors }"
      >
        <p class="watt-label end-date-label">
          {{ translations.createTransferAgreementProposal.timeframe.endDate.label | transloco
          }}<span class="asterisk">*</span>
        </p>
        <div class="radio-buttons-container">
          <watt-radio group="has_enddate" formControlName="hasEndDate" [value]="false">
            {{
              translations.createTransferAgreementProposal.timeframe.endDate.noEndDateLabel
                | transloco
            }}
          </watt-radio>
          <div class="end-by-container">
            <watt-radio group="has_enddate" formControlName="hasEndDate" [value]="true">
              {{
                translations.createTransferAgreementProposal.timeframe.endDate.withEndDateLabel
                  | transloco
              }}
            </watt-radio>
            @if (form.value.hasEndDate) {
              <eo-transfers-datetime
                formControlName="endDate"
                [min]="minEndDate"
                [existingTransferAgreements]="existingTransferAgreements"
              />
            }

            <eo-transfers-errors
              [showError]="!!form.controls.endDate.errors || !!form.controls.hasEndDate.errors"
            >
              <watt-field-error
                [style.opacity]="form.controls.endDate.errors?.['minToday'] ? 1 : 0"
              >
                {{
                  translations.createTransferAgreementProposal.timeframe.endDate.minToday
                    | transloco
                }}
              </watt-field-error>
              <watt-field-error
                [style.opacity]="
                  form.controls.endDate.errors?.['endDateMustBeLaterThanStartDate'] ? 1 : 0
                "
              >
                {{
                  translations.createTransferAgreementProposal.timeframe.endDate.laterThanStartDate
                    | transloco
                }}
              </watt-field-error>
              <watt-field-error
                [style.opacity]="form.controls.hasEndDate.errors?.['overlapping']?.end ? 1 : 0"
              >
                @if (form.controls.hasEndDate.errors?.['overlapping']?.end; as error) {
                  {{
                    translations.createTransferAgreementProposal.timeframe.endDate
                      .withoutEndDateOverlapping
                      | transloco
                        : {
                            startDate: error.startDate | wattDate: 'long',
                            endDate:
                              (error.endDate | wattDate: 'long') ||
                                translations.createTransferAgreementProposal.timeframe.endDate
                                  .noEndDateLabel | transloco,
                          }
                  }}
                }
              </watt-field-error>
              <watt-field-error
                [style.opacity]="form.controls.endDate.errors?.['overlapping']?.end ? 1 : 0"
              >
                @if (form.controls.endDate.errors?.['overlapping']?.end; as error) {
                  {{
                    translations.createTransferAgreementProposal.timeframe.endDate
                      .withEndDateOverlapping
                      | transloco
                        : {
                            startDate: error.startDate | wattDate: 'long',
                            endDate:
                              (error.endDate | wattDate: 'long') ||
                                translations.createTransferAgreementProposal.timeframe.endDate
                                  .noEndDateLabel | transloco,
                          }
                  }}
                }
              </watt-field-error>
            </eo-transfers-errors>
          </div>
        </div>
      </fieldset>
    </ng-container>
  `,
})
export class EoTransfersPeriodComponent implements OnInit {
  @Input() formGroupName!: string;
  @Input() existingTransferAgreements: EoExistingTransferAgreement[] = [];

  protected translations = translations;
  protected form!: FormGroup<EoTransfersPeriodForm>;
  protected minStartDate: Date = new Date();
  protected minEndDate: Date = new Date();

  private _destroyRef = inject(DestroyRef);
  private _rootFormGroup = inject(FormGroupDirective);

  ngOnInit() {
    this.initForm();
    this.subscribeStartDateChanges();
    this.subscribeHasEndDateChanges();
  }

  resetHours(date: number): number {
    return new Date(date).setHours(0, 0, 0, 0);
  }

  private initForm() {
    this.form = this._rootFormGroup.control.get(this.formGroupName) as FormGroup;
    this.form.addControl(
      'hasEndDate',
      new FormControl(
        {
          value: !!this.form.controls.endDate.value,
          disabled: this.form.controls.endDate.disabled,
        },
        { nonNullable: true }
      )
    );
  }

  private subscribeStartDateChanges() {
    if (this.form.controls.startDate.enabled) {
      this.form.controls['startDate'].valueChanges
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe((startDate) => {
          const today = new Date();

          this.minEndDate =
            startDate && isAfter(new Date(startDate), today) ? new Date(startDate) : new Date();
        });
    }
  }

  private subscribeHasEndDateChanges() {
    this.form.controls['hasEndDate'].valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((hasEndDate) => {
        this.setEndDateAndTimeBasedOnStartDateAndTime(hasEndDate);
      });
  }

  private setEndDateAndTimeBasedOnStartDateAndTime(hasEndDate: boolean) {
    if (hasEndDate && this.form.controls['startDate'].value) {
      const nextDay = add(new Date(this.form.controls['startDate'].value), {
        days: 1,
      });

      this.form.controls['endDate'].setValue(
        isAfter(nextDay, this.minEndDate) ? nextDay.getTime() : this.minEndDate.getTime()
      );
    } else {
      this.form.controls['endDate'].setValue(null);
    }
  }
}
