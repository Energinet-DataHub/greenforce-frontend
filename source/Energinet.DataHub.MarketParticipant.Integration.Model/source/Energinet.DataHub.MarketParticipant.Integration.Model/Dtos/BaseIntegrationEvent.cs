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
    public abstract record BaseIntegrationEvent
    {
        /// <summary>
        /// A base event representing a change.
        /// </summary>
        /// <param name="id">Unique integration event ID.</param>
        /// <param name="eventCreated">event creation time</param>
        protected BaseIntegrationEvent(
            Guid id,
            DateTime eventCreated)
        {
            Id = id;
            EventCreated = eventCreated;
            Type = GetType().Name;
        }

        public Guid Id { get; }
        public DateTime EventCreated { get; }
        public string Type { get; }
    }
}
