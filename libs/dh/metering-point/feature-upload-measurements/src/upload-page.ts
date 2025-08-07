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
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WattDropZone } from '@energinet-datahub/watt/dropzone';

import {
  GetMeteringPointUploadMetadataByIdDocument,
  MeteringPointSubType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import {
  DhEmDashFallbackPipe,
  dhMakeFormControl,
  injectRelativeNavigate,
} from '@energinet-datahub/dh/shared/ui-util';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

import { DhUploadMeasurementsService } from './upload-service';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import { MeasureDataResult } from './models/measure-data-result';

@Component({
  selector: 'dh-measurements-upload',
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
    WattDropZone,
    WattFieldErrorComponent,
    WATT_CARD,
    DhEmDashFallbackPipe,
  ],
  styles: `
    @use '@energinet-datahub/watt/utils' as watt;

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

    .summary-table {
      width: 100%;
      border-collapse: collapse;

      & tr {
        height: 44px;
      }

      & th {
        text-align: left;
        padding-left: var(--watt-space-m);
      }

      & td {
        text-align: right;
        padding-right: var(--watt-space-m);
      }

      & th {
        @include watt.typography-watt-label;
      }

      & tfoot tr {
        background: var(--watt-color-primary-ultralight);
      }

      & tfoot td {
        @include watt.typography-font-weight('semi-bold');
      }
    }
  `,
  template: `
    <watt-card vater fill="vertical" *transloco="let t; read: 'meteringPoint.measurements'">
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
        <watt-description-list variant="compact" *transloco="let tCommon">
          <watt-description-list-item [label]="t('upload.quality')">
            {{ quality() && t('quality.' + quality()) | dhEmDashFallback }}
          </watt-description-list-item>
          <watt-description-list-item [label]="t('upload.resolution')">
            {{ resolution() && tCommon('resolution.' + resolution()) | dhEmDashFallback }}
          </watt-description-list-item>
          <watt-description-list-item [label]="t('upload.measureUnit')">
            {{ measureUnit() && t('units.' + measureUnit()) | dhEmDashFallback }}
          </watt-description-list-item>
        </watt-description-list>
        @if (!file.valid || progress() !== 100) {
          <watt-dropzone
            accept="text/csv"
            [label]="t('upload.dropzone')"
            [formControl]="file"
            [progress]="progress() ?? 100"
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
          <vater-stack align="start" gap="m">
            <watt-datepicker [label]="t('upload.datepicker')" [formControl]="date" />
            <table class="summary-table">
              <tbody>
                <tr>
                  <th>{{ t('upload.table.positionCount') }}</th>
                  <td>{{ totalPositions() }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th>{{ t('upload.table.sum') }}</th>
                  <td>{{ totalSum() }}</td>
                </tr>
              </tfoot>
            </table>
          </vater-stack>
        }
        <vater-spacer />
      </vater-flex>
    </watt-card>
  `,
})
export class DhUploadMeasurementsComponent {
  private navigate = injectRelativeNavigate();
  protected measurements = inject(DhUploadMeasurementsService);

  meteringPointId = input.required<string>();
  private readonly featureFlagsService = inject(DhFeatureFlagsService);
  private meteringPointQuery = query(GetMeteringPointUploadMetadataByIdDocument, () => ({
    fetchPolicy: 'cache-only',
    variables: {
      meteringPointId: this.meteringPointId(),
      enableNewSecurityModel: this.featureFlagsService.isEnabled('new-security-model'),
    },
  }));

  metadata = computed(() => this.meteringPointQuery.data()?.meteringPoint?.metadata);
  measureUnit = computed(() => this.metadata()?.measureUnit);
  resolution = computed(() => this.metadata()?.resolution);
  handleInvalidMeteringPointSubTypeEffect = effect(() => {
    if (this.metadata()?.subType === MeteringPointSubType.Calculated) {
      this.navigate('..');
    }
  });

  csv = signal<MeasureDataResult | null>(null, { equal: () => false });
  totalSum = computed(() => this.csv()?.sum ?? 0);
  totalPositions = computed(() => this.csv()?.measurements.length ?? 0);
  progress = computed(() => (this.csv()?.isFatal ? undefined : this.csv()?.progress));
  quality = computed(() => {
    const qualities = this.csv()?.qualities;
    if (!qualities?.size) return null;
    const [first] = qualities;
    return qualities.size > 1 ? 'MIXED' : first;
  });

  private validate = async (): Promise<ValidationErrors | null> => {
    if (!this.file.value) return null;
    const [file] = this.file.value;
    const resolution = this.resolution();
    assertIsDefined(resolution);
    await this.measurements.parseFile(file, resolution).forEach(this.csv.set);
    return this.csv()?.errors ?? null;
  };

  file = dhMakeFormControl<File[]>(null, Validators.required, this.validate);
  date = dhMakeFormControl<Date>({ value: null, disabled: true }, Validators.required);

  updateDateEffect = effect(() => {
    const csv = this.csv();
    if (csv?.progress !== 100) return;
    const start = csv?.maybeGetDateRange()?.start;
    if (start) this.date.setValue(start);
  });

  submit = () => {
    const csv = this.csv();
    const metadata = this.metadata();
    assertIsDefined(csv);
    assertIsDefined(metadata);
    this.measurements.send(this.meteringPointId(), metadata.type, csv);
  };
}
