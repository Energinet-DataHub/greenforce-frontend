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

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Models;

/// <summary>
/// Represents a metering point's data
/// </summary>
/// <param name="InternalId">
/// A representation of the metering point GSRN id, without containing the actual GSRN id. Is used to
/// show in the URL, to avoid saving the real metering point id in the browser history.
/// </param>
/// <param name="MeteringPointIdentification">
/// The metering point GSRN id, eg. 57XXXXXXXXXXXXXXXX.
/// </param>
/// <param name="Type"></param>
/// <param name="ConnectionState"></param>
/// <param name="CreatedDate"></param>
/// <param name="ConnectionDate"></param>
/// <param name="ClosedDownDate"></param>
/// <param name="DisconnectionDate"></param>
public record RelatedMeteringPointDto(
    string InternalId,
    string MeteringPointIdentification,
    MeteringPointType Type,
    ConnectionState ConnectionState,
    DateTimeOffset? CreatedDate,
    DateTimeOffset? ConnectionDate,
    DateTimeOffset? ClosedDownDate,
    DateTimeOffset? DisconnectionDate);
