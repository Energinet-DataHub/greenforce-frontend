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

using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Model.BusinessRoles;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using Energinet.DataHub.MarketParticipant.Domain.Services.Rules;
using SimpleInjector;

namespace Energinet.DataHub.MarketParticipant.Common
{
    internal static class DomainServiceRegistration
    {
        public static void AddServices(this Container container)
        {
            container.Register<IActorIntegrationEventsQueueService, ActorIntegrationEventsQueueService>(Lifestyle.Scoped);
            container.Register<IGridAreaIntegrationEventsQueueService, GridAreaIntegrationEventsQueueService>(Lifestyle.Scoped);
            container.Register<IOrganizationIntegrationEventsQueueService, OrganizationIntegrationEventsQueueService>(Lifestyle.Scoped);

            container.Register<IUniqueGlobalLocationNumberRuleService, UniqueGlobalLocationNumberRuleService>(Lifestyle.Scoped);
            container.Register<IOverlappingBusinessRolesRuleService, OverlappingBusinessRolesRuleService>(Lifestyle.Scoped);
            container.Register<IOverlappingActorContactCategoriesRuleService, OverlappingActorContactCategoriesRuleService>(Lifestyle.Scoped);
            container.Register<ICombinationOfBusinessRolesRuleService, CombinationOfBusinessRolesRuleService>(Lifestyle.Scoped);
            container.Register<IAllowedGridAreasRuleService, AllowedGridAreasRuleService>(Lifestyle.Scoped);

            container.Register<IExternalActorIdConfigurationService, ExternalActorIdConfigurationService>(Lifestyle.Scoped);
            container.Register<IUniqueMarketRoleGridAreaService, UniqueMarketRoleGridAreaService>(Lifestyle.Scoped);
            container.Register<IUniqueOrganizationBusinessRegisterIdentifierService, UniqueOrganizationBusinessRegisterIdentifierService>(Lifestyle.Scoped);

            container.Register<IActorFactoryService, ActorFactoryService>(Lifestyle.Scoped);
            container.Register<IOrganizationFactoryService, OrganizationFactoryService>(Lifestyle.Scoped);
            container.Register<IGridAreaFactoryService, GridAreaFactoryService>(Lifestyle.Scoped);
            container.Register<IBusinessRoleCodeDomainService, BusinessRoleCodeDomainService>(Lifestyle.Scoped);
            container.Collection.Register<IBusinessRole>(
                new ElectricalSupplierRole(),
                new BalanceResponsiblePartyRole(),
                new DanishEnergyAgencyRole(),
                new GridOperatorRole(),
                new ImbalanceSettlementResponsibleRole(),
                new MeteredDataAdministratorRole(),
                new MeteredDataResponsibleRole(),
                new MeteringPointAdministratorRole(),
                new SystemOperatorRole(),
                new TransmissionSystemOperatorRole());

            container.Register<IActorStatusMarketRolesRuleService, ActorStatusMarketRolesRuleService>(Lifestyle.Scoped);
        }
    }
}
