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

namespace Energinet.DataHub.MarketParticipant.Integration.Model.Dtos
{
    public sealed record GridAreaCreatedIntegrationEvent : BaseIntegrationEvent
    {
        /// <summary>
        /// An event representing an update to a given GridArea.
        /// </summary>
        /// <param name="id">Unique integration event ID.</param>
        /// <param name="eventCreated">event creation time</param>
        /// <param name="gridAreaId">Grid Area ID.</param>
        /// <param name="name">Name of the Grid Area.</param>
        /// <param name="code">The code for the Grid Area</param>
        /// <param name="priceAreaCode">The price area code for this Grid Area</param>
        /// <param name="gridAreaLinkId">The gridAreaLinkId for this GridArea</param>
        public GridAreaCreatedIntegrationEvent(
            Guid id,
            DateTime eventCreated,
            Guid gridAreaId,
            string name,
            string code,
            PriceAreaCode priceAreaCode,
            Guid gridAreaLinkId)
        : base(id, eventCreated)
        {
            GridAreaId = gridAreaId;
            Name = name;
            Code = code;
            PriceAreaCode = priceAreaCode;
            GridAreaLinkId = gridAreaLinkId;
        }

        public Guid GridAreaId { get; }
        public string Name { get; }
        public string Code { get; }
        public PriceAreaCode PriceAreaCode { get; }
        public Guid GridAreaLinkId { get; }
    }
}
