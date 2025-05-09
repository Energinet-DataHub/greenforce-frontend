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

using Energinet.DataHub.Measurements.Abstractions.Api.Models;
using ResolutionEnum = Energinet.DataHub.Measurements.Abstractions.Api.Models.Resolution;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.Types;

[ObjectType<MeasurementPositionDto>]
public static partial class MeasurementPositionDtoType
{
    public static MeasurementPointDto? Current([Parent] MeasurementPositionDto measurementPosition) => measurementPosition.MeasurementPoints.OrderBy(x => x.Order).FirstOrDefault();

    public static bool HasQuantityOrQualityChanged([Parent] MeasurementPositionDto measurementPosition)
    {
        var firstMeasurementPoint = measurementPosition.MeasurementPoints.OrderBy(x => x.Order).FirstOrDefault();

        if (firstMeasurementPoint == null)
        {
            return false;
        }

        return measurementPosition.MeasurementPoints
            .OrderBy(x => x.Order)
            .Skip(1)
            .Any(x =>
            {
                var hasQuantityChanged = x.Quantity != firstMeasurementPoint.Quantity;
                var hasQualityChanged = x.Quality != firstMeasurementPoint.Quality;

                return hasQuantityChanged || hasQualityChanged;
            });
    }

    public static ResolutionEnum Resolution([Parent] MeasurementPositionDto measurementPosition)
    {
        var firstMeasurementPoint = measurementPosition.MeasurementPoints.OrderBy(x => x.Order).FirstOrDefault();

        if (firstMeasurementPoint == null)
        {
            return ResolutionEnum.Hourly;
        }

        return firstMeasurementPoint.Resolution;
    }

    public static IEnumerable<MeasurementPointDto> Historic([Parent] MeasurementPositionDto measurementPosition) => measurementPosition.MeasurementPoints.OrderBy(x => x.Order).Skip(1);
}
