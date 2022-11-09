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

namespace Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents.GridAreaIntegrationEvents
{
    public sealed class GridAreaUpdatedIntegrationEvent : IntegrationEventBase
    {
        public GridAreaId GridAreaId { get; set; } = null!;
        public GridAreaName Name { get; set; } = null!;
        public GridAreaCode Code { get; set; } = null!;
        public PriceAreaCode PriceAreaCode { get; set; } = PriceAreaCode.Dk1;
        public GridAreaLinkId GridAreaLinkId { get; set; } = null!;
    }
}
