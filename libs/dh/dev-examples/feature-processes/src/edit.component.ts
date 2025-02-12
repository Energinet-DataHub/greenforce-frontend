import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { afterRenderEffect, Component, computed, inject, viewChild } from '@angular/core';

import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@ngneat/transloco';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';

import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';

@Component({
  selector: 'dh-edit-process',
  imports: [
    TranslocoPipe,
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_MODAL,
    WattButtonComponent,
    WattCheckboxComponent,
  ],
  template: `
    <watt-modal
      *transloco="let t; read: 'devExamples.processes.edit'"
      [title]="t('title')"
      #modal
      (closed)="navigation.navigate('details', id())"
    >
      <form
        vater-flex
        direction="column"
        gap="s"
        offset="m"
        [formGroup]="form"
        id="edit-process-form"
        (ngSubmit)="save()"
      >
        <watt-checkbox [formControl]="form.controls.stopProcess">{{
          t('stopProcess')
        }}</watt-checkbox>
      </form>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">{{
          'cancel' | transloco
        }}</watt-button>
        <watt-button type="submit" formId="edit-process-form">{{ 'save' | transloco }}</watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhEditProcessComponent {
  transloco = inject(TranslocoService);
  fb = inject(NonNullableFormBuilder);
  toast = inject(WattToastService);
  navigation = inject(DhNavigationService);
  modal = viewChild(WattModalComponent);

  id = computed(() => this.navigation.id());

  form = this.fb.group({
    stopProcess: this.fb.control(false),
  });

  constructor() {
    afterRenderEffect(() => {
      const id = this.id();
      if (!id) return;
      this.modal()?.open();
    });
  }

  save() {
    const stopProcess = this.form.controls.stopProcess.value;

    if (stopProcess)
      this.toast.open({
        message: this.transloco.translate('devExamples.processes.edit.processStopped'),
        type: 'success',
      });
    if (!stopProcess)
      this.toast.open({
        message: this.transloco.translate('devExamples.processes.edit.processDidNotStop'),
        type: 'warning',
      });

    this.modal()?.close(true);
  }
}
