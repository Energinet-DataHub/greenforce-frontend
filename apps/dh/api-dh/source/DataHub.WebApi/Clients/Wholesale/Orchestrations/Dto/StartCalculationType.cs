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

namespace Energinet.DataHub.WebApi.Clients.Wholesale.Orchestrations.Dto;

/// <summary>
/// Defines the wholesale calculation type
/// </summary>
public enum StartCalculationType
{
    /// <summary>
    /// Balance fixing
    /// </summary>
    BalanceFixing = 0,

    /// <summary>
    /// Aggregation.
    /// </summary>
    Aggregation = 1,

    /// <summary>
    /// Wholesale fixing.
    /// </summary>
    WholesaleFixing = 2,

    /// <summary>
    /// First correction settlement.
    /// </summary>
    FirstCorrectionSettlement = 3,

    /// <summary>
    /// Second correction settlement.
    /// </summary>
    SecondCorrectionSettlement = 4,

    /// <summary>
    /// Third correction settlement.
    /// </summary>
    ThirdCorrectionSettlement = 5,
}
