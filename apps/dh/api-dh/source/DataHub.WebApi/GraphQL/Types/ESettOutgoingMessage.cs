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
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.WebApi.Clients.ESettExchange.v1;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class ESettOutgoingMessage
    {
        public string DocumentId { get; set; } = default!;

        public DateTimeOffset Created { get; set; } = default!;

        public GridAreaDto GridArea { get; set; } = default!;

        public ProcessType ProcessType { get; set; } = default!;

        public TimeSeriesType TimeSeriesType { get; set; } = default!;

        public DateTimeOffset PeriodFrom { get; set; } = default!;

        public DateTimeOffset PeriodTo { get; set; } = default!;

        public DocumentStatus DocumentStatus { get; set; } = default!;

        public string? GetDispatchDocumentLink { get; set; } = default!;

        public string? GetResponseDocumentLink { get; set; } = default!;
    }
}
