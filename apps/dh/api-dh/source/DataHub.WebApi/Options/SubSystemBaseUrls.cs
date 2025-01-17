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

using System.ComponentModel.DataAnnotations;

namespace Energinet.DataHub.WebApi.Options;

public sealed record SubSystemBaseUrls
{
    public const string SectionName = "SubSystemBaseUrls";

    [Required]
    public string MarketParticipantBaseUrl { get; set; } = string.Empty;

    [Required]
    public string WholesaleBaseUrl { get; set; } = string.Empty;

    [Required]
    public string WholesaleOrchestrationsBaseUrl { get; set; } = string.Empty;

    [Required]
    public string WholesaleOrchestrationSettlementReportsBaseUrl { get; set; } = string.Empty;

    [Required]
    public string WholesaleOrchestrationSettlementReportsLightBaseUrl { get; set; } = string.Empty;

    [Required]
    public string ESettExchangeBaseUrl { get; set; } = string.Empty;

    [Required]
    public string EdiB2CWebApiBaseUrl { get; set; } = string.Empty;

    [Required]
    public string ImbalancePricesBaseUrl { get; set; } = string.Empty;

    [Required]
    public string SettlementReportsAPIBaseUrl { get; set; } = string.Empty;

    [Required]
    public string NotificationsBaseUrl { get; set; } = string.Empty;

    [Required]
    public string Dh2BridgeBaseUrl { get; set; } = string.Empty;

    [Required]
    public string ElectricityMarketBaseUrl { get; set; } = string.Empty;
}
