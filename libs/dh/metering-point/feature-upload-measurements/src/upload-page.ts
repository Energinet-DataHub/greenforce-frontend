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
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WATT_CARD } from '@energinet/watt/card';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet/watt/description-list';
import { WattDropdownComponent, WattDropdownOption } from '@energinet/watt/dropdown';
import { WattDropZone } from '@energinet/watt/dropzone';
import { WattFieldErrorComponent, WattFieldHintComponent } from '@energinet/watt/field';
import { WattFileField } from '@energinet/watt/file-field';

import {
  GetMeteringPointUploadMetadataByIdDocument,
  MeteringPointSubType,
  SendMeasurementsResolution,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhEmDashFallbackPipe,
  dhMakeFormControl,
  injectRelativeNavigate,
} from '@energinet-datahub/dh/shared/ui-util';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';

import { MeasureDataResult } from './models/measure-data-result';
import { DhUploadMeasurementsSummaryTable } from './summary-table';
import { DhUploadMeasurementsService } from './upload-service';

@Component({
  selector: 'dh-upload-measurements-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslocoDirective,

    VaterFlexComponent,
    VaterUtilityDirective,
    VaterSpacerComponent,
    VaterStackComponent,
    WattButtonComponent,
    WattDatepickerComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattDropdownComponent,
    WattDropZone,
    WattFieldErrorComponent,
    WattFileField,
    WATT_CARD,
    DhEmDashFallbackPipe,
    DhUploadMeasurementsSummaryTable,
    WattFieldHintComponent,
  ],
  styles: `
    watt-card-title {
      /* non-standard spacing */
      padding-bottom: var(--watt-space-l);
    }

    watt-dropzone {
      /* special size for dropzone */
      min-width: min(100%, 674px);
    }

    watt-datepicker {
      min-width: max-content;
    }
  `,
  template: `
    <watt-card vater fill="vertical" *transloco="let t; prefix: 'meteringPoint.measurements'">
      <watt-card-title>
        <vater-stack direction="row" gap="m">
          <h3>{{ t('upload.title') }}</h3>
          <vater-spacer />
          <watt-button variant="secondary" [routerLink]="'..'">
            {{ t('upload.cancel') }}
          </watt-button>
          @if (file.valid) {
            <watt-button
              variant="primary"
              [disabled]="date.invalid"
              [routerLink]="'..'"
              (click)="submit()"
            >
              {{ t('upload.approve') }}
            </watt-button>
          }
        </vater-stack>
      </watt-card-title>
      <vater-flex wrap direction="row" gap="xl" align="baseline">
        <vater-stack direction="column" gap="m" align="stretch" *transloco="let tCommon">
          <watt-dropdown
            [label]="t('upload.resolution')"
            [formControl]="resolution"
            [options]="resolutionOptions()"
            [showResetOption]="false"
          >
            @if (resolution.disabled) {
              <watt-field-hint>
                {{ t('upload.resolutionHint') }}
              </watt-field-hint>
            }
          </watt-dropdown>
          <watt-description-list variant="compact">
            <watt-description-list-item [label]="t('upload.quality')">
              {{ quality() && t('quality.' + quality()) | dhEmDashFallback }}
            </watt-description-list-item>
            <watt-description-list-item [label]="t('upload.measureUnit')">
              {{ measureUnit() && t('units.' + measureUnit()) | dhEmDashFallback }}
            </watt-description-list-item>
          </watt-description-list>
        </vater-stack>
        @if (!file.valid) {
          <watt-dropzone
            accept="text/csv"
            [label]="t('upload.dropzone')"
            [formControl]="file"
            [progress]="progress()"
            [showProgressBar]="showProgressBar()"
          >
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
        } @else {
          <vater-stack align="stretch" gap="m">
            <watt-file-field
              [label]="t('upload.file')"
              [file]="file.value?.[0]"
              (clear)="reset()"
            />
            <watt-datepicker [label]="t('upload.datepicker')" [formControl]="date">
              <watt-field-hint>
                {{ t('upload.datepickerHint') }}
              </watt-field-hint>
            </watt-datepicker>
            <dh-upload-measurements-summary-table
              [positions]="totalPositions()"
              [sum]="totalSum()"
            />
          </vater-stack>
        }
        <vater-spacer />
      </vater-flex>
    </watt-card>
  `,
})
export class DhUploadMeasurementsPage {
  readonly meteringPointId = input.required<string>();

  private navigate = injectRelativeNavigate();
  private measurements = inject(DhUploadMeasurementsService);
  private transloco = inject(TranslocoService);
  private meteringPointQuery = query(GetMeteringPointUploadMetadataByIdDocument, () => ({
    fetchPolicy: 'cache-only',
    variables: {
      meteringPointId: this.meteringPointId(),
    },
  }));

  metadata = computed(() => this.meteringPointQuery.data()?.meteringPoint?.metadata);
  measureUnit = computed(() => this.metadata()?.measureUnit);
  meteringPointResolution = computed(() => this.metadata()?.resolution);

  preventCalculatedSubTypeEffect = effect(() => {
    if (this.metadata()?.subType === MeteringPointSubType.Calculated) {
      this.navigate('..');
    }
  });

  resolutionOptions = computed<WattDropdownOption[]>(() => [
    SendMeasurementsResolution.QuarterHourly,
    SendMeasurementsResolution.Hourly,
    SendMeasurementsResolution.Monthly,
  ].map((resolution) => ({
    value: resolution,
    displayValue: this.transloco.translate(`resolution.${resolution}`),
  })));

  csv = signal<MeasureDataResult | null>(null, { equal: () => false });
  totalSum = computed(() => this.csv()?.sum ?? 0);
  totalPositions = computed(() => this.csv()?.measurements.length ?? 0);
  progress = computed(() => this.csv()?.progress ?? 0);
  showProgressBar = computed(() => !!this.csv() && this.progress() < 100 && !this.csv()?.isFatal);
  quality = computed(() => {
    const qualities = this.csv()?.qualities;
    if (!qualities?.size) return null;
    const [first] = qualities;
    return qualities.size > 1 ? 'MIXED' : first;
  });

  private validate = async (): Promise<ValidationErrors | null> => {
    if (!this.file.value) return null;
    const [file] = this.file.value;
    const resolution = this.resolution.getRawValue();
    assertIsDefined(resolution);
    await this.measurements.parseFile(file, resolution).forEach(this.csv.set);
    const errors = this.csv()?.errors;
    return errors && errors.length > 0 ? errors : null;
  };

  resolution = dhMakeFormControl<SendMeasurementsResolution | null>(null, Validators.required);
  resolutionValue = toSignal(this.resolution.valueChanges);
  file = dhMakeFormControl<File[]>(null, Validators.required, this.validate);
  date = dhMakeFormControl<Date>({ value: null, disabled: true }, Validators.required);

  setDefaultResolutionEffect = effect(() => {
    const meteringPointResolution = this.meteringPointResolution();

    if (meteringPointResolution && !this.resolution.dirty) {
      this.resolution.setValue(this.measurements.mapResolution(meteringPointResolution));
    }
  });

  setStartDateEffect = effect(() => {
    const csv = this.csv();
    if (csv?.progress !== 100) return;

    const start = csv?.maybeGetDateRange()?.start;
    if (start) this.date.setValue(start);
  });

  toggleResolutionEffect = effect(() => {
    const csv = this.csv();
    const isValidUpload = csv?.progress === 100 && !csv?.errors.length;

    if (isValidUpload) {
      this.resolution.disable();
    } else {
      this.resolution.enable();
    }
  });

  revalidateEffect = effect(() => {
    const resolution = this.resolutionValue();

    if (resolution && this.file.value && this.resolution.dirty) {
      this.csv.set(null);
      this.file.setValue([...this.file.value]);
    }
  });

  submit = () => {
    const csv = this.csv();
    const metadata = this.metadata();
    const selectedResolution = this.resolution.getRawValue();
    assertIsDefined(csv);
    assertIsDefined(metadata);
    assertIsDefined(selectedResolution);
    this.measurements.send(
      this.meteringPointId(),
      metadata.type,
      metadata.measureUnit,
      selectedResolution,
      csv
    );
  };

  reset = () => {
    const meteringPointResolution = this.meteringPointResolution();
    if (meteringPointResolution) {
      this.resolution.setValue(this.measurements.mapResolution(meteringPointResolution));
    }
    this.file.reset();
    this.date.reset();
    this.csv.set(null);
  };
}
