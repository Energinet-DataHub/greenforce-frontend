//#region License
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
//#endregion
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';

import { WATT_MODAL } from '@energinet/watt/modal';
import { WattDropZone } from '@energinet/watt/dropzone';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattFieldErrorComponent, WattFieldHintComponent } from '@energinet/watt/field';

import { injectToast, dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';

import {
  AddChargeSeriesDocument,
  GetChargeByIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';

import {
  parseChargeSeries,
  ChargeSeriesResult,
} from '@energinet-datahub/dh/charges/feature-parse-series';

@Component({
  selector: 'dh-charges-upload-series',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WattButtonComponent,
    WattDropZone,
    WattFieldErrorComponent,
    WATT_MODAL,
    WattFieldHintComponent,
  ],
  template: `
    <watt-modal
      #modal
      *transloco="let t; prefix: 'charges.actions.uploadSeries'"
      autoOpen
      size="small"
      [title]="t('title')"
      (closed)="save($event)"
    >
      <watt-dropzone
        accept="text/csv"
        [formControl]="file"
        [progress]="progress()"
        [showProgressBar]="progress() > 0"
        [loadingMessage]="progress() === 100 ? t('success') : t('loading')"
      >
        @if (!progress()) {
          <watt-field-hint>{{ t('hint') }}</watt-field-hint>
        }
        @if (file.errors?.multiple) {
          <watt-field-error>
            {{ t('errors.multiple') }}
          </watt-field-error>
        } @else if (file.errors?.type) {
          <watt-field-error>
            {{ t('errors.type') }}
          </watt-field-error>
        } @else if (file.errors) {
          <watt-field-error>
            {{ t('csvErrors.' + file.errors[0]?.key, { row: file.errors[0]?.index + 2 }) }}
          </watt-field-error>
        }
      </watt-dropzone>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('close') }}
        </watt-button>
        <watt-button variant="primary" [disabled]="!file.valid" (click)="modal.close(true)">
          {{ t('submit') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export default class DhChargesUploadSeries {
  private readonly navigate = inject(DhNavigationService);
  id = input.required<string>();
  query = query(GetChargeByIdDocument, () => ({ variables: { id: this.id() } }));
  addChargeSeries = mutation(AddChargeSeriesDocument);
  toast = injectToast('charges.actions.uploadSeries.toast');
  toastEffect = effect(() => this.toast(this.addChargeSeries.status()));
  resolution = computed(() => this.query.data()?.chargeById?.resolution);

  private validate = async (): Promise<ValidationErrors | null> => {
    if (!this.file.value) return null;
    const [file] = this.file.value;
    const resolution = this.resolution();
    assertIsDefined(resolution);
    await parseChargeSeries(file, resolution).forEach(this.chargeSeries.set);
    const errors = this.chargeSeries()?.errors;
    return errors?.length ? errors : null;
  };

  file = dhMakeFormControl<File[]>(null, Validators.required, this.validate);
  chargeSeries = signal<ChargeSeriesResult | null>(null, { equal: () => false });
  progress = computed(() => this.chargeSeries()?.progress ?? 0);

  async save(saved: boolean) {
    if (!saved) return this.navigate.navigate('details', this.id());
    if (!this.file.valid) return;

    const start = this.chargeSeries()?.first;
    const end = this.chargeSeries()?.last;
    const points = this.chargeSeries()?.points;
    assertIsDefined(start);
    assertIsDefined(end);
    assertIsDefined(points);

    await this.addChargeSeries.mutate({
      variables: {
        input: {
          id: this.id(),
          start: start.toDate(),
          end: end.toDate(),
          points,
        },
      },
    });

    this.navigate.navigate('details', this.id());
  }
}
