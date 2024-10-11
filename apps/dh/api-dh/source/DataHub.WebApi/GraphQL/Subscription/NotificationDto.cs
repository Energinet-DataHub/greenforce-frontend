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

using System.Reactive.Linq;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.GraphQL.Extensions;
using Energinet.DataHub.WebApi.GraphQL.Types.Calculation;
using HotChocolate.Subscriptions;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL.Subscription;

public sealed class NotificationDto
{
    public string ReasonIdentifier { get; set; } = null!;

    public string RelatedId { get; set; } = null!;

    public DateTimeOffset OccurredAt { get; set; }

    public DateTimeOffset ExpiresAt { get; set; }
}
