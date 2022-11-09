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

using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Repositories;
using SimpleInjector;

namespace Energinet.DataHub.MarketParticipant.Common
{
    internal static class RepositoryRegistration
    {
        public static void AddRepositories(this Container container)
        {
            container.Register<IActorContactRepository, ActorContactRepository>(Lifestyle.Scoped);
            container.Register<IGridAreaRepository, GridAreaRepository>(Lifestyle.Scoped);
            container.Register<IOrganizationRepository, OrganizationRepository>(Lifestyle.Scoped);
            container.Register<IDomainEventRepository, DomainEventRepository>(Lifestyle.Scoped);
            container.Register<IGridAreaLinkRepository, GridAreaLinkRepository>(Lifestyle.Scoped);
            container.Register<IUniqueActorMarketRoleGridAreaRepository, UniqueActorMarketRoleGridAreaRepository>(Lifestyle.Scoped);
            container.Register<IGridAreaOverviewRepository, GridAreaOverviewRepository>(Lifestyle.Scoped);
            container.Register<IGridAreaAuditLogEntryRepository, GridAreaAuditLogEntryRepository>(Lifestyle.Scoped);
        }
    }
}
