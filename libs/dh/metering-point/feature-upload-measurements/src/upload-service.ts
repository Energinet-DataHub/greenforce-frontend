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
  SendMeasurementsDocument,
  SendMeasurementsResolution,
  SendMeasurementsMeteringPointType,
  SendMeasurementsMeasurementUnit,
  ElectricityMarketViewMeteringPointMeasureUnit,
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
  mapResolution(resolution: string): SendMeasurementsResolution {
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

  /** Maps metering point type to more narrow type.  */
  private mapMeteringPointType = (type: ElectricityMarketMeteringPointType) => {
    switch (type) {
      case ElectricityMarketMeteringPointType.Consumption:
        return SendMeasurementsMeteringPointType.Consumption;
      case ElectricityMarketMeteringPointType.Production:
        return SendMeasurementsMeteringPointType.Production;
      case ElectricityMarketMeteringPointType.Exchange:
        return SendMeasurementsMeteringPointType.Exchange;
      case ElectricityMarketMeteringPointType.VeProduction:
        return SendMeasurementsMeteringPointType.VeProduction;
      case ElectricityMarketMeteringPointType.Analysis:
        return SendMeasurementsMeteringPointType.Analysis;
      case ElectricityMarketMeteringPointType.SurplusProductionGroup6:
        return SendMeasurementsMeteringPointType.SurplusProductionGroup6;
      case ElectricityMarketMeteringPointType.NetProduction:
        return SendMeasurementsMeteringPointType.NetProduction;
      case ElectricityMarketMeteringPointType.SupplyToGrid:
        return SendMeasurementsMeteringPointType.SupplyToGrid;
      case ElectricityMarketMeteringPointType.ConsumptionFromGrid:
        return SendMeasurementsMeteringPointType.ConsumptionFromGrid;
      case ElectricityMarketMeteringPointType.WholesaleServicesOrInformation:
        return SendMeasurementsMeteringPointType.WholesaleServicesInformation;
      case ElectricityMarketMeteringPointType.OwnProduction:
        return SendMeasurementsMeteringPointType.OwnProduction;
      case ElectricityMarketMeteringPointType.NetFromGrid:
        return SendMeasurementsMeteringPointType.NetFromGrid;
      case ElectricityMarketMeteringPointType.NetToGrid:
        return SendMeasurementsMeteringPointType.NetToGrid;
      case ElectricityMarketMeteringPointType.TotalConsumption:
        return SendMeasurementsMeteringPointType.TotalConsumption;
      case ElectricityMarketMeteringPointType.OtherConsumption:
        return SendMeasurementsMeteringPointType.OtherConsumption;
      case ElectricityMarketMeteringPointType.OtherProduction:
        return SendMeasurementsMeteringPointType.OtherProduction;
      case ElectricityMarketMeteringPointType.ExchangeReactiveEnergy:
        return SendMeasurementsMeteringPointType.ExchangeReactiveEnergy;
      case ElectricityMarketMeteringPointType.CollectiveNetProduction:
        return SendMeasurementsMeteringPointType.CollectiveNetProduction;
      case ElectricityMarketMeteringPointType.CollectiveNetConsumption:
        return SendMeasurementsMeteringPointType.CollectiveNetConsumption;
      case ElectricityMarketMeteringPointType.InternalUse:
        return SendMeasurementsMeteringPointType.InternalUse;
      case ElectricityMarketMeteringPointType.CapacitySettlement:
      case ElectricityMarketMeteringPointType.ActivatedDownregulation:
      case ElectricityMarketMeteringPointType.ActivatedUpregulation:
      case ElectricityMarketMeteringPointType.ActualConsumption:
      case ElectricityMarketMeteringPointType.ActualProduction:
      case ElectricityMarketMeteringPointType.NotUsed:
      case ElectricityMarketMeteringPointType.NetLossCorrection:
      case ElectricityMarketMeteringPointType.ElectricalHeating:
      case ElectricityMarketMeteringPointType.NetConsumption:
        throw new Error(`Unsupported metering point type: ${type}`);
    }
  };

  private mapMeasurementUnit(unit: ElectricityMarketViewMeteringPointMeasureUnit): SendMeasurementsMeasurementUnit {
    switch (unit) {
      case ElectricityMarketViewMeteringPointMeasureUnit.KvArh:
        return SendMeasurementsMeasurementUnit.KiloVoltAmpereReactiveHour;
      case ElectricityMarketViewMeteringPointMeasureUnit.KWh:
        return SendMeasurementsMeasurementUnit.KilowattHour;
      default:
        // Default to kWh for any other unit types
        return SendMeasurementsMeasurementUnit.KilowattHour;
    }
  }

  /** Parses a CSV file of measurement data, streaming the result. */
  parseFile(file: File, resolution: SendMeasurementsResolution) {
    return parseMeasurements(file, resolution);
  }

  /** Sends measurements to the server. */
  send(
    meteringPointId: string,
    meteringPointType: ElectricityMarketMeteringPointType,
    measurementUnit: ElectricityMarketViewMeteringPointMeasureUnit,
    resolution: SendMeasurementsResolution,
    result: MeasureDataResult
  ) {
    const interval = result.maybeGetDateRange();
    assertIsDefined(interval?.start);
    assertIsDefined(interval?.end);
    assert(!result.errors.length);
    this.sendMeasurements.mutate({
      variables: {
        input: {
          meteringPointId,
          meteringPointType: this.mapMeteringPointType(meteringPointType),
          measurementUnit: this.mapMeasurementUnit(measurementUnit),
          resolution,
          start: interval.start,
          end: interval.end,
          measurements: result.measurements,
        },
      },
    });
  }
}
