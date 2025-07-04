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
  CsvParseResult,
  MeasurementsCSV,
  CsvParseService,
  KVANTUM_STATUS,
} from '@energinet-datahub/dh/metering-point/feature-measurements-csv-parser';
import {
  GetMeteringPointUploadMetadataByIdDocument,
  MeteringPointType2,
  SendMeasurementsResolution,
  ElectricityMarketMeteringPointType,
  SendMeasurementsQuality,
  MeteringPointSubType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import {
  DhEmDashFallbackPipe,
  dhMakeFormControl,
  injectRelativeNavigate,
} from '@energinet-datahub/dh/shared/ui-util';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

import { DhMeasurementsUploadDataService } from './upload-data.service';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';

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
            {{ csv()?.quality && t('quality.' + csv()?.quality) | dhEmDashFallback }}
          </watt-description-list-item>
          <watt-description-list-item [label]="t('upload.resolution')">
            {{ resolution() && tCommon('resolution.' + resolution()) | dhEmDashFallback }}
          </watt-description-list-item>
          <watt-description-list-item [label]="t('upload.measureUnit')">
            {{ measureUnit() && t('units.' + measureUnit()) | dhEmDashFallback }}
          </watt-description-list-item>
        </watt-description-list>
        @if (!file.valid || csv()?.progress !== 100) {
          <watt-dropzone
            accept="text/csv"
            [label]="t('upload.dropzone')"
            [formControl]="file"
            [progress]="csv()?.progress ?? 100"
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
                {{ t('csvErrors.' + file.errors[0]?.key, { row: file.errors[0]?.row }) }}
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
                  <td>
                    {{ csv()?.totalPositions }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th>{{ t('upload.table.sum') }}</th>
                  <td>
                    {{ csv()?.totalSum }}
                  </td>
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
export class DhMeasurementsUploadComponent {
  private navigate = injectRelativeNavigate();
  protected measurements = inject(DhMeasurementsUploadDataService);
  private readonly csvParser: CsvParseService = inject(CsvParseService);

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

  csv = signal<CsvParseResult | null>(null);
  private validate = async (): Promise<ValidationErrors | null> => {
    if (!this.file.value) return null;
    const [file] = this.file.value;
    const result$ = await this.csvParser.parseFile(file);
    await result$.forEach(this.csv.set);
    return this.csv()?.errors ?? null;
  };

  file = dhMakeFormControl<File[]>(null, Validators.required, this.validate);
  date = dhMakeFormControl<Date>({ value: null, disabled: true }, Validators.required);

  updateDateEffect = effect(() => {
    const csv = this.csv();
    if (csv?.progress !== 100) return;
    this.date.setValue(csv.start);
  });

  private mapToMeteringPointType2(type: ElectricityMarketMeteringPointType): MeteringPointType2 {
    switch (type) {
      case 'Consumption':
        return MeteringPointType2.Consumption;
      case 'Production':
        return MeteringPointType2.Production;
      case 'Exchange':
        return MeteringPointType2.Exchange;
      case 'VEProduction':
        return MeteringPointType2.VeProduction;
      case 'Analysis':
        return MeteringPointType2.Analysis;
      default:
        throw new Error(`Unsupported metering point type: ${type}`);
    }
  }

  private mapToSendMeasurementsResolution(resolution: string): SendMeasurementsResolution {
    switch (resolution) {
      case 'PT15M':
        return SendMeasurementsResolution.QuarterHourly;
      case 'PT1H':
        return SendMeasurementsResolution.Hourly;
      case 'P1M':
        return SendMeasurementsResolution.Monthly;
      default:
        throw new Error(`Unsupported resolution: ${resolution}`);
    }
  }

  private mapToSendMeasurementsQuality(quality: string): SendMeasurementsQuality {
    switch (quality) {
      case 'A03':
      case 'Målt':
        return SendMeasurementsQuality.Measured;
      case 'A04':
      case 'Estimeret':
        return SendMeasurementsQuality.Estimated;
      default:
        throw new Error(`Unsupported quality: ${quality}`);
    }
  }

  submit = () => {
    const { start, end, measurements } = this.csv() as CsvParseResult;
    const metadata = this.metadata();

    assertIsDefined(start);
    assertIsDefined(end);
    assertIsDefined(metadata);

    this.measurements.send({
      start,
      end,
      measurements: measurements.map((x: MeasurementsCSV) => ({
        position: parseInt(x.Position),
        quantity: parseInt(x['Værdi']),
        quality: this.mapToSendMeasurementsQuality(x[KVANTUM_STATUS]),
      })),
      meteringPointId: this.meteringPointId(),
      meteringPointType: this.mapToMeteringPointType2(metadata.type),
      resolution: this.mapToSendMeasurementsResolution(metadata.resolution),
    });
  };
}
