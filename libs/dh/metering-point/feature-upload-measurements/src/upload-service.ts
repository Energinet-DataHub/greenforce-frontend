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
import { effect, Injectable } from '@angular/core';
import {
  ElectricityMarketMeteringPointType,
  MeteringPointType2,
  SendMeasurementsDocument,
  SendMeasurementsResolution,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { MeasureDataResult } from './models/measure-data-result';
import { injectToast } from '@energinet-datahub/dh/shared/ui-util';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { assert, assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import { parseMeasurements } from './parse-measurements';

@Injectable({ providedIn: 'root' })
export class DhUploadMeasurementsService {
  private toast = injectToast('meteringPoint.measurements.upload.toast');
  private sendMeasurements = mutation(SendMeasurementsDocument);
  protected toastEffect = effect(() => this.toast(this.sendMeasurements.status()));

  /** Maps resolution string to SendMeasurementsResolution. */
  private mapResolution = (resolution: string) => {
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
  };

  /** Maps metering point type to more narrow type.  */
  private mapMeteringPointType = (type: ElectricityMarketMeteringPointType) => {
    switch (type) {
      case ElectricityMarketMeteringPointType.Consumption:
        return MeteringPointType2.Consumption;
      case ElectricityMarketMeteringPointType.Production:
        return MeteringPointType2.Production;
      case ElectricityMarketMeteringPointType.Exchange:
        return MeteringPointType2.Exchange;
      case ElectricityMarketMeteringPointType.VeProduction:
        return MeteringPointType2.VeProduction;
      case ElectricityMarketMeteringPointType.Analysis:
        return MeteringPointType2.Analysis;
      default:
        throw new Error(`Unsupported metering point type: ${type}`);
    }
  };

  /** Parses a CSV file of measurement data, streaming the result. */
  parseFile = (file: File, resolution: string) =>
    parseMeasurements(file, this.mapResolution(resolution));

  /** Sends measurements to the server. */
  send = (
    meteringPointId: string,
    meteringPointType: ElectricityMarketMeteringPointType,
    result: MeasureDataResult
  ) => {
    const interval = result.maybeGetDateRange();
    assertIsDefined(interval?.start);
    assertIsDefined(interval?.end);
    assert(!result.errors.length);
    this.sendMeasurements.mutate({
      variables: {
        input: {
          meteringPointId,
          meteringPointType: this.mapMeteringPointType(meteringPointType),
          resolution: result.resolution,
          start: interval.start,
          end: interval.end,
          measurements: result.measurements,
        },
      },
    });
  };
}
