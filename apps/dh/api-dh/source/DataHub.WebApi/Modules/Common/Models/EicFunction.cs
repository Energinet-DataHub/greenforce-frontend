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

using System.Runtime.CompilerServices;
using Energinet.DataHub.WebApi.Modules.Common.Utilities;

namespace Energinet.DataHub.WebApi.Modules.Common.Models;

public record EicFunction : Enumeration<EicFunction>
{
    public static readonly EicFunction BalanceResponsibleParty = new();
    public static readonly EicFunction BillingAgent = new();
    public static readonly EicFunction EnergySupplier = new();
    public static readonly EicFunction GridAccessProvider = new();
    public static readonly EicFunction ImbalanceSettlementResponsible = new();
    public static readonly EicFunction MeterOperator = new();
    public static readonly EicFunction MeteredDataAdministrator = new();
    public static readonly EicFunction MeteredDataResponsible = new();
    public static readonly EicFunction MeteringPointAdministrator = new();
    public static readonly EicFunction SystemOperator = new();
    public static readonly EicFunction DanishEnergyAgency = new();
    public static readonly EicFunction DataHubAdministrator = new();
    public static readonly EicFunction IndependentAggregator = new();
    public static readonly EicFunction SerialEnergyTrader = new();
    public static readonly EicFunction Delegated = new();
    public static readonly EicFunction ItSupplier = new();

    private EicFunction([CallerMemberName] string name = "")
        : base(name) { }
}
