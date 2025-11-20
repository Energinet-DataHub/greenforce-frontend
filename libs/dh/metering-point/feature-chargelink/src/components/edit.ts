import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';

import { VaterStackComponent } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattTypedModal, WATT_MODAL } from '@energinet/watt/modal';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattTextFieldComponent } from '@energinet/watt/text-field';

@Component({
  selector: 'dh-metering-point-edit-charge-link',
  imports: [
    WATT_MODAL,
    TranslocoDirective,
    WattDatepickerComponent,
    WattTextFieldComponent,
    ReactiveFormsModule,
    VaterStackComponent,
    WattButtonComponent,
  ],
  styles: `
    :host {
      form > * {
        width: 50%;
      }
    }
  `,
  template: `
    <watt-modal
      size="small"
      #edit
      *transloco="let t; prefix: 'meteringPoint.chargeLinks.edit'"
      [title]="t('title')"
    >
      <form vater-stack align="start" direction="column" gap="s" tabindex="-1" [formGroup]="form">
        <watt-text-field [formControl]="form.controls.factor" [label]="t('factor')" type="number" />
        <watt-datepicker [formControl]="form.controls.startDate" [label]="t('startDate')" />
      </form>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="edit.close(false)">
          {{ t('close') }}
        </watt-button>
        <watt-button
          variant="primary"
          (click)="editLink(); edit.close(true)"
          [disabled]="form.invalid"
        >
          {{ t('save') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhMeteringPointEditChargeLink extends WattTypedModal {
  private readonly fb = inject(NonNullableFormBuilder);
  form = this.fb.group({
    factor: this.fb.control<number | null>(null, Validators.min(1)),
    startDate: this.fb.control<Date | null>(null, Validators.required),
  });

  editLink() {
    console.log('Editing link with values:', this.form.value);
  }
}
