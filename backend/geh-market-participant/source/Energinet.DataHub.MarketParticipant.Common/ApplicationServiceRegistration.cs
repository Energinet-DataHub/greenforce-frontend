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

using Energinet.DataHub.MarketParticipant.Application.Commands;
using Energinet.DataHub.MarketParticipant.Application.Commands.Actor;
using Energinet.DataHub.MarketParticipant.Application.Commands.Contact;
using Energinet.DataHub.MarketParticipant.Application.Commands.GridArea;
using Energinet.DataHub.MarketParticipant.Application.Commands.Organization;
using Energinet.DataHub.MarketParticipant.Application.Helpers;
using Energinet.DataHub.MarketParticipant.Application.Services;
using Energinet.DataHub.MarketParticipant.Application.Validation;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Repositories;
using Energinet.DataHub.MarketParticipant.Infrastructure.Services;
using Energinet.DataHub.MarketParticipant.Integration.Model.Parsers;
using Energinet.DataHub.MarketParticipant.Integration.Model.Parsers.Actor;
using Energinet.DataHub.MarketParticipant.Integration.Model.Parsers.GridArea;
using Energinet.DataHub.MarketParticipant.Integration.Model.Parsers.Organization;
using FluentValidation;
using SimpleInjector;

namespace Energinet.DataHub.MarketParticipant.Common
{
    internal static class ApplicationServiceRegistration
    {
        public static void AddApplicationServices(this Container container)
        {
            container.Register<IValidator<GetOrganizationsCommand>, GetOrganizationsCommandRuleSet>(Lifestyle.Scoped);
            container.Register<IValidator<CreateOrganizationCommand>, CreateOrganizationCommandRuleSet>(Lifestyle.Scoped);
            container.Register<IValidator<CreateActorCommand>, CreateActorCommandRuleSet>(Lifestyle.Scoped);
            container.Register<IValidator<UpdateOrganizationCommand>, UpdateOrganizationCommandRuleSet>(Lifestyle.Scoped);
            container.Register<IValidator<UpdateActorCommand>, UpdateActorCommandRuleSet>(Lifestyle.Scoped);
            container.Register<IValidator<DispatchEventsCommand>, DispatchEventsCommandRuleSet>(Lifestyle.Scoped);
            container.Register<IValidator<GetSingleOrganizationCommand>, GetSingleOrganizationCommandRuleSet>(Lifestyle.Scoped);
            container.Register<IValidator<GetSingleActorCommand>, GetSingleActorCommandRuleSet>(Lifestyle.Scoped);
            container.Register<IValidator<GetActorsCommand>, GetActorsCommandRuleSet>(Lifestyle.Scoped);
            container.Register<IValidator<GetActorContactsCommand>, GetActorContactsCommandRuleSet>(Lifestyle.Scoped);
            container.Register<IValidator<CreateActorContactCommand>, CreateActorContactCommandRuleSet>(Lifestyle.Scoped);
            container.Register<IValidator<DeleteActorContactCommand>, DeleteActorContactCommandRuleSet>(Lifestyle.Scoped);
            container.Register<IValidator<CreateGridAreaCommand>, CreateGridAreaCommandRuleSet>(Lifestyle.Scoped);
            container.Register<IValidator<UpdateGridAreaCommand>, UpdateGridAreaCommandRuleSet>(Lifestyle.Scoped);
            container.Register<IValidator<GetGridAreasCommand>, GetGridAreasCommandRuleSet>(Lifestyle.Scoped);
            container.Register<IValidator<GetGridAreaCommand>, GetGridAreaCommandRuleSet>(Lifestyle.Scoped);
            container.Register<IValidator<ForceSendIntegrationEventsCommand>, ForceSendIntegrationEventsCommandRuleSet>();
            container.Register<IValidator<GetGridAreaOverviewCommand>, GetGridAreaOverviewCommandRuleSet>();
            container.Register<IValidator<GetGridAreaAuditLogEntriesCommand>, GetGridAreaAuditLogEntriesCommandRuleSet>();
            container.Register<IValidator<SynchronizeActorsCommand>, SynchronizeActorsCommandRuleSet>();

            container.Register<IActiveDirectoryService, ActiveDirectoryB2cService>(Lifestyle.Scoped);
            container.Register<IOrganizationExistsHelperService, OrganizationExistsHelperService>(Lifestyle.Scoped);
            container.Register<IOrganizationIntegrationEventsHelperService, OrganizationIntegrationEventsHelperService>(Lifestyle.Scoped);
            container.Register<IActorUpdatedIntegrationEventParser, ActorUpdatedIntegrationEventParser>(Lifestyle.Scoped);
            container.Register<IActorCreatedIntegrationEventParser, ActorCreatedIntegrationEventParser>(Lifestyle.Scoped);
            container.Register<IChangesToActorHelper, ChangesToActorHelper>(Lifestyle.Scoped);
            container.Register<IGridAreaIntegrationEventParser, GridAreaIntegrationEventParser>(Lifestyle.Scoped);
            container.Register<IGridAreaUpdatedIntegrationEventParser, GridAreaUpdatedIntegrationEventParser>(Lifestyle.Scoped);
            container.Register<IGridAreaNameChangedIntegrationEventParser, GridAreaNameChangedIntegrationEventParser>(Lifestyle.Scoped);
            container.Register<IOrganizationCreatedIntegrationEventParser, OrganizationCreatedIntegrationEventParser>(Lifestyle.Scoped);
            container.Register<IOrganizationNameChangedIntegrationEventParser, OrganizationNameChangedIntegrationEventParser>(Lifestyle.Scoped);
            container.Register<IOrganizationStatusChangedIntegrationEventParser, OrganizationStatusChangedIntegrationEventParser>(Lifestyle.Scoped);
            container.Register<IOrganizationCommentChangedIntegrationEventParser, OrganizationCommentChangedIntegrationEventParser>(Lifestyle.Scoped);
            container.Register<IOrganizationBusinessRegisterIdentifierChangedIntegrationEventParser, OrganizationBusinessRegisterIdentifierChangedIntegrationEventParser>(Lifestyle.Scoped);
            container.Register<IOrganizationAddressChangedIntegrationEventParser, OrganizationAddressChangedIntegrationEventParser>(Lifestyle.Scoped);
            container.Register<IOrganizationUpdatedIntegrationEventParser, OrganizationUpdatedIntegrationEventParser>(Lifestyle.Scoped);
            container.Register<IActorStatusChangedIntegrationEventParser, ActorStatusChangedIntegrationEventParser>();
            container.Register<IActorNameChangedIntegrationEventParser, ActorNameChangedIntegrationEventParser>();
            container.Register<IActorExternalIdChangedIntegrationEventParser, ActorExternalIdChangedIntegrationEventParser>();
            container.Register<IMeteringPointTypeAddedToActorIntegrationEventParser, MeteringPointTypeAddedToActorIntegrationEventParser>();
            container.Register<IMeteringPointTypeRemovedFromActorIntegrationEventParser, MeteringPointTypeRemovedFromActorIntegrationEventParser>();
            container.Register<IGridAreaAddedToActorIntegrationEventParser, GridAreaAddedToActorIntegrationEventParser>();
            container.Register<IGridAreaRemovedFromActorIntegrationEventParser, GridAreaRemovedFromActorIntegrationEventParser>();
            container.Register<IMarketRoleAddedToActorIntegrationEventParser, MarketRoleAddedToActorIntegrationEventParser>();
            container.Register<IMarketRoleRemovedFromActorIntegrationEventParser, MarketRoleRemovedFromActorIntegrationEventParser>();
            container.Register<IContactRemovedFromActorIntegrationEventParser, ContactRemovedFromActorIntegrationEventParser>();
            container.Register<IContactAddedToActorIntegrationEventParser, ContactAddedToActorIntegrationEventParser>();
            container.Register<IUserDisplayNameProvider, UserDisplayNameProvider>();
            container.Register<IExternalActorSynchronizationRepository, ExternalActorSynchronizationRepository>(Lifestyle.Scoped);

            container.Collection.Register(typeof(IIntegrationEventDispatcher), typeof(ActorUpdatedEventDispatcher).Assembly);
        }
    }
}
