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

using System.Collections.Frozen;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant;

public static class MarketRoleTranslator
{
    private static readonly FrozenDictionary<(EicFunction, string), string> MarketRoleTranslations =
        new Dictionary<(EicFunction, string), string>
        {
            [(EicFunction.BalanceResponsibleParty, "da")] = "Balanceansvarlig",
            [(EicFunction.BillingAgent, "da")] = "Faktureringsagent",
            [(EicFunction.EnergySupplier, "da")] = "Elleverandør",
            [(EicFunction.GridAccessProvider, "da")] = "Netvirksomhed",
            [(EicFunction.ImbalanceSettlementResponsible, "da")] = "Ubalanceafregningsansvarlig",
            [(EicFunction.MeteredDataAdministrator, "da")] = "Beskedsadministrator - aggregeringer",
            [(EicFunction.MeteredDataResponsible, "da")] = "Måledataansvarlig",
            [(EicFunction.MeteringPointAdministrator, "da")] = "Beskedadministrator",
            [(EicFunction.MeterOperator, "da")] = "Måleoperatør",
            [(EicFunction.SystemOperator, "da")] = "Systemoperatør",
            [(EicFunction.DanishEnergyAgency, "da")] = "Energistyrelsen",
            [(EicFunction.DataHubAdministrator, "da")] = "DataHub systemadministrator",
            [(EicFunction.IndependentAggregator, "da")] = "Uafhængig aggregator",
            [(EicFunction.SerialEnergyTrader, "da")] = "Seriel elhandler",
            [(EicFunction.Delegated, "da")] = "Delegeret",
            [(EicFunction.ItSupplier, "da")] = "IT-leverandør",
            [(EicFunction.BalanceResponsibleParty, "en")] = "Balance responsible party",
            [(EicFunction.BillingAgent, "en")] = "Billing agent",
            [(EicFunction.EnergySupplier, "en")] = "Energy supplier",
            [(EicFunction.GridAccessProvider, "en")] = "Grid access provider",
            [(EicFunction.ImbalanceSettlementResponsible, "en")] = "Imbalance settlement responsible",
            [(EicFunction.MeteredDataAdministrator, "en")] = "Metered data administrator",
            [(EicFunction.MeteredDataResponsible, "en")] = "Metered data responsible",
            [(EicFunction.MeteringPointAdministrator, "en")] = "Metering point administrator",
            [(EicFunction.MeterOperator, "en")] = "Meter Operator",
            [(EicFunction.SystemOperator, "en")] = "System operator",
            [(EicFunction.DanishEnergyAgency, "en")] = "The Danish Energy Agency",
            [(EicFunction.DataHubAdministrator, "en")] = "DataHub system administrator",
            [(EicFunction.IndependentAggregator, "en")] = "Independent aggregator",
            [(EicFunction.SerialEnergyTrader, "en")] = "Serial Energy Trader",
            [(EicFunction.Delegated, "en")] = "Delegated",
            [(EicFunction.ItSupplier, "en")] = "IT supplier",
        }.ToFrozenDictionary();

    public static string Translate(EicFunction eicFunction, IHttpContextAccessor httpContextAccessor)
    {
        var lang = httpContextAccessor.HttpContext?.Request.Headers.AcceptLanguage.ToString();
        var key = lang?.StartsWith("en", StringComparison.OrdinalIgnoreCase) == true ? "en" : "da";
        return MarketRoleTranslations.GetValueOrDefault((eicFunction, key), eicFunction.ToString());
    }
}
