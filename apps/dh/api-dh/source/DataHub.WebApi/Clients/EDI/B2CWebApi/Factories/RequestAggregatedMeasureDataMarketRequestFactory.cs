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

using System;
using Energinet.DataHub.Edi.B2CWebApp.Clients.v1;

namespace Energinet.DataHub.WebApi.Clients.EDI.B2CWebApi.Factories;

public static class RequestAggregatedMeasureDataMarketRequestFactory
{
    public static RequestAggregatedMeasureDataMarketRequest Create(
        string businessReason,
        string meteringPointType,
        string startDate,
        string? endDate,
        string? gridArea,
        string? energySupplierId,
        string? balanceResponsibleId)
    {
        var request = new RequestAggregatedMeasureDataMarketRequest();
        request.BusinessReason = businessReason;
        request.MeteringPointType = MapMeteringPointType(meteringPointType);
        request.StartDate = startDate;
        request.EndDate = endDate;
        request.GridArea = gridArea;
        request.EnergySupplierId = energySupplierId;
        request.BalanceResponsibleId = balanceResponsibleId;
        return request;
    }

    private static MeteringPointType MapMeteringPointType(string meteringPointType)
    {
        return meteringPointType switch
        {
            "Production" => MeteringPointType._0,
            "FlexConsumption" => MeteringPointType._1,
            "TotalConsumption" => MeteringPointType._2,
            "NonProfiledConsumption" => MeteringPointType._3,
            "Exchange" => MeteringPointType._4,
            _ => throw new ArgumentOutOfRangeException(nameof(meteringPointType), meteringPointType, null),
        };
    }
}
