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
import { Component, computed, inject, input } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WattDropZone } from '@energinet-datahub/watt/dropzone';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';
import { TranslocoDirective } from '@jsverse/transloco';
import { DhMeasurementsUploadService } from './upload.service';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetMeteringPointUploadMetadataByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';

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

    .summary-table {
      width: 100%;
      border-collapse: collapse;

      & tr {
        height: 44px;
      }

      & th {
        text-align: left;
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
          <watt-button variant="secondary" [routerLink]="'../month'">
            {{ t('upload.cancel') }}
          </watt-button>
          @if (csv.value) {
            <watt-button
              variant="primary"
              [routerLink]="'../month'"
              [disabled]="date.invalid"
              (click)="measurements.upload({})"
            >
              {{ t('upload.approve') }}
            </watt-button>
          }
        </vater-stack>
      </watt-card-title>
      <vater-flex wrap direction="row" gap="xl" align="baseline">
        <watt-description-list variant="compact" *transloco="let tCommon">
          <watt-description-list-item [label]="t('upload.quality')">
            <!-- TODO: Get this from parsed CSV file -->
            {{ null | dhEmDashFallback }}
          </watt-description-list-item>
          <watt-description-list-item [label]="t('upload.resolution')">
            {{ resolution() && tCommon('resolution.' + resolution()) | dhEmDashFallback }}
          </watt-description-list-item>
          <watt-description-list-item [label]="t('upload.measureUnit')">
            {{ measureUnit() && t('units.' + measureUnit()) | dhEmDashFallback }}
          </watt-description-list-item>
        </watt-description-list>
        @if (!csv.value) {
          <watt-dropzone accept="text/csv" [label]="t('upload.dropzone')" [formControl]="file" />
        } @else {
          <vater-stack align="start" gap="m">
            <watt-datepicker [label]="t('upload.datepicker')" [formControl]="date" />
            <table class="summary-table">
              <tbody>
                <tr>
                  <th>{{ t('upload.table.positionCount') }}</th>
                  <td>
                    <!-- TODO: Get count from parsed CSV file -->
                    96
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th>{{ t('upload.table.sum') }}</th>
                  <td>
                    <!-- TODO: Get sum from parsed CSV file -->
                    84,444
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
  meteringPointId = input.required<string>();

  protected measurements = inject(DhMeasurementsUploadService);
  private readonly featureFlagsService = inject(DhFeatureFlagsService);
  private query = query(GetMeteringPointUploadMetadataByIdDocument, () => ({
    fetchPolicy: 'cache-only',
    variables: {
      meteringPointId: this.meteringPointId(),
      enableNewSecurityModel: this.featureFlagsService.isEnabled('new-security-model'),
    },
  }));

  metadata = computed(() => this.query.data()?.meteringPoint?.metadata);
  measureUnit = computed(() => this.metadata()?.measureUnit);
  resolution = computed(() => this.metadata()?.resolution);

  private csv: string | null = null;
  private parse = async (file: File) => {
    if (this.csv) return this.csv;
    const text = await file.text();
    // convert to csv
    this.csv = text;
    return text;
  };

  private validate = async (
    control: AbstractControl<File[] | null>
  ): Promise<ValidationErrors | null> => {
    const file = control.value?.[0];
    if (!file) return null;
    const csv = await this.parse(file);
    console.log(csv);
    // validate and return errors here
    return null;
  };

  file = new FormControl<File[] | null>(null, { asyncValidators: this.validate });
  date = new FormControl<Date | null>(null);
}
