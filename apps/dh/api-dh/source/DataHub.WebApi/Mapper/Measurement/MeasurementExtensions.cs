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

using Energinet.DataHub.EDI.B2CClient.Abstractions.SendMeasurements.V1;
using Energinet.DataHub.WebApi.Mapper.MeteringPoint;
using Energinet.DataHub.WebApi.Model;
using Energinet.DataHub.WebApi.Model.Measurements;

namespace Energinet.DataHub.WebApi.Mapper.Measurement;

public static class MeasurementExtensions
{
    public static SendMeasurementsRequestV1 MapToSendMeasurementsV1(
        this SendMeasurementsRequestV2 source)
    {
        if (source == null)
        {
            throw new ArgumentNullException(nameof(source));
        }

        return new SendMeasurementsRequestV1(
            MeteringPointId: source.MeteringPointId,
            MeteringPointType: source.MeteringPointType.MapToSendMeasurementsV1(),
            MeasurementUnit: source.MeasurementUnit.MapToSendMeasurementsV1(),
            Resolution: source.Resolution.MapToSendMeasurementsV1(),
            Start: source.Start,
            End: source.End,
            Measurements: source.Measurements
                .Select(m => m.MapToSendMeasurementsV1())
                .ToList());
    }

    public static MeasurementUnitV1 MapToSendMeasurementsV1(this MeasurementUnit source) =>
        source switch
        {
            MeasurementUnit.KilowattHour => MeasurementUnitV1.KilowattHour,
            MeasurementUnit.KiloVoltAmpereReactiveHour => MeasurementUnitV1.KiloVoltAmpereReactiveHour,
        };

    public static ResolutionV1 MapToSendMeasurementsV1(this Resolution source) =>
        source switch
        {
            Resolution.Monthly => ResolutionV1.Monthly,
            Resolution.Hourly => ResolutionV1.Hourly,
            Resolution.QuarterHourly => ResolutionV1.QuarterHourly,
        };

    public static QualityV1 MapToSendMeasurementsV1(this Quality source) =>
        source switch
        {
            Quality.Estimated => QualityV1.Estimated,
            Quality.Measured => QualityV1.Measured,
        };

    public static MeasurementV1 MapToSendMeasurementsV1(this Model.Measurements.Measurement source)
    {
        ArgumentNullException.ThrowIfNull(source);

        return new MeasurementV1(
            Position: source.Position,
            Quantity: (decimal)source.Quantity, // Note that Model.Measurements.Measurement.Quantity is a double to match GraphQL-float. This should be no problem as long as we go from double to decimal.
            Quality: source.Quality.MapToSendMeasurementsV1());
    }
}
