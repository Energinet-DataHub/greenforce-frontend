// Copyright 2020 Energinet DataHub A/S
//
// Licensed under the Apache License, Version 2.0 (the "License2");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using Energinet.DataHub.WebApi.Modules.Common.Enums;
using RequestAggregatedMeasureDataMeteringPointTypeV1 = Energinet.DataHub.EDI.B2CClient.Abstractions.RequestAggregatedMeasureData.V1.MeteringPointTypeV1;
using SendMeasurementsMeteringPointTypeV1 = Energinet.DataHub.EDI.B2CClient.Abstractions.SendMeasurements.V1.MeteringPointTypeV1;

namespace Energinet.DataHub.WebApi.Modules.Common.Extensions;

public static class MeteringPointTypeExtensions
{
    public static SendMeasurementsMeteringPointTypeV1 MapToSendMeasurementsV1(this MeteringPointType source)
    {
        return source switch
        {
            MeteringPointType.Consumption => SendMeasurementsMeteringPointTypeV1.Consumption,
            MeteringPointType.Production => SendMeasurementsMeteringPointTypeV1.Production,
            MeteringPointType.Exchange => SendMeasurementsMeteringPointTypeV1.Exchange,
            MeteringPointType.VeProduction => SendMeasurementsMeteringPointTypeV1.VeProduction,
            MeteringPointType.Analysis => SendMeasurementsMeteringPointTypeV1.Analysis,
            MeteringPointType.SurplusProductionGroup6 => SendMeasurementsMeteringPointTypeV1.SurplusProductionGroup6,
            MeteringPointType.NetProduction => SendMeasurementsMeteringPointTypeV1.NetProduction,
            MeteringPointType.SupplyToGrid => SendMeasurementsMeteringPointTypeV1.SupplyToGrid,
            MeteringPointType.ConsumptionFromGrid => SendMeasurementsMeteringPointTypeV1.ConsumptionFromGrid,
            MeteringPointType.WholesaleServicesInformation => SendMeasurementsMeteringPointTypeV1.WholesaleServicesInformation,
            MeteringPointType.OwnProduction => SendMeasurementsMeteringPointTypeV1.OwnProduction,
            MeteringPointType.NetFromGrid => SendMeasurementsMeteringPointTypeV1.NetFromGrid,
            MeteringPointType.NetToGrid => SendMeasurementsMeteringPointTypeV1.NetToGrid,
            MeteringPointType.TotalConsumption => SendMeasurementsMeteringPointTypeV1.TotalConsumption,
            MeteringPointType.OtherConsumption => SendMeasurementsMeteringPointTypeV1.OtherConsumption,
            MeteringPointType.OtherProduction => SendMeasurementsMeteringPointTypeV1.OtherProduction,
            MeteringPointType.ExchangeReactiveEnergy => SendMeasurementsMeteringPointTypeV1.ExchangeReactiveEnergy,
            MeteringPointType.CollectiveNetProduction => SendMeasurementsMeteringPointTypeV1.CollectiveNetProduction,
            MeteringPointType.CollectiveNetConsumption => SendMeasurementsMeteringPointTypeV1.CollectiveNetConsumption,
            MeteringPointType.InternalUse => SendMeasurementsMeteringPointTypeV1.InternalUse,
        };
    }

    public static SendMeasurementsMeteringPointTypeV1? MapToSendMeasurementsV1(this MeteringPointType? source)
    {
        return source?.MapToSendMeasurementsV1();
    }

    public static RequestAggregatedMeasureDataMeteringPointTypeV1 MapToRequestAggregatedMeasureDataV1(this MeteringPointType source)
    {
        return source switch
        {
            MeteringPointType.Consumption => RequestAggregatedMeasureDataMeteringPointTypeV1.Consumption,
            MeteringPointType.Production => RequestAggregatedMeasureDataMeteringPointTypeV1.Production,
            MeteringPointType.Exchange => RequestAggregatedMeasureDataMeteringPointTypeV1.Exchange,
            MeteringPointType.VeProduction => RequestAggregatedMeasureDataMeteringPointTypeV1.VeProduction,
            MeteringPointType.Analysis => RequestAggregatedMeasureDataMeteringPointTypeV1.Analysis,
            MeteringPointType.SurplusProductionGroup6 => RequestAggregatedMeasureDataMeteringPointTypeV1.SurplusProductionGroup6,
            MeteringPointType.NetProduction => RequestAggregatedMeasureDataMeteringPointTypeV1.NetProduction,
            MeteringPointType.SupplyToGrid => RequestAggregatedMeasureDataMeteringPointTypeV1.SupplyToGrid,
            MeteringPointType.ConsumptionFromGrid => RequestAggregatedMeasureDataMeteringPointTypeV1.ConsumptionFromGrid,
            MeteringPointType.WholesaleServicesInformation => RequestAggregatedMeasureDataMeteringPointTypeV1.WholesaleServicesInformation,
            MeteringPointType.OwnProduction => RequestAggregatedMeasureDataMeteringPointTypeV1.OwnProduction,
            MeteringPointType.NetFromGrid => RequestAggregatedMeasureDataMeteringPointTypeV1.NetFromGrid,
            MeteringPointType.NetToGrid => RequestAggregatedMeasureDataMeteringPointTypeV1.NetToGrid,
            MeteringPointType.TotalConsumption => RequestAggregatedMeasureDataMeteringPointTypeV1.TotalConsumption,
            MeteringPointType.OtherConsumption => RequestAggregatedMeasureDataMeteringPointTypeV1.OtherConsumption,
            MeteringPointType.OtherProduction => RequestAggregatedMeasureDataMeteringPointTypeV1.OtherProduction,
            MeteringPointType.ExchangeReactiveEnergy => RequestAggregatedMeasureDataMeteringPointTypeV1.ExchangeReactiveEnergy,
            MeteringPointType.CollectiveNetProduction => RequestAggregatedMeasureDataMeteringPointTypeV1.CollectiveNetProduction,
            MeteringPointType.CollectiveNetConsumption => RequestAggregatedMeasureDataMeteringPointTypeV1.CollectiveNetConsumption,
            MeteringPointType.InternalUse => RequestAggregatedMeasureDataMeteringPointTypeV1.InternalUse,
        };
    }

    public static RequestAggregatedMeasureDataMeteringPointTypeV1? MapToRequestAggregatedMeasureDataV1(this MeteringPointType? source)
    {
        return source?.MapToRequestAggregatedMeasureDataV1();
    }
}
