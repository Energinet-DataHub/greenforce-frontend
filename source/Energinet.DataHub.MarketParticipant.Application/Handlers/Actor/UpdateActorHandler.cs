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
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Application.Commands.Actor;
using Energinet.DataHub.MarketParticipant.Application.Helpers;
using Energinet.DataHub.MarketParticipant.Application.Mappers;
using Energinet.DataHub.MarketParticipant.Application.Services;
using Energinet.DataHub.MarketParticipant.Domain;
using Energinet.DataHub.MarketParticipant.Domain.Exception;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using Energinet.DataHub.MarketParticipant.Domain.Services.Rules;
using MediatR;

namespace Energinet.DataHub.MarketParticipant.Application.Handlers.Actor
{
    public sealed class UpdateActorHandler : IRequestHandler<UpdateActorCommand>
    {
        private readonly IOrganizationRepository _organizationRepository;
        private readonly IOrganizationExistsHelperService _organizationExistsHelperService;
        private readonly IUnitOfWorkProvider _unitOfWorkProvider;
        private readonly IChangesToActorHelper _changesToActorHelper;
        private readonly IActorIntegrationEventsQueueService _actorIntegrationEventsQueueService;
        private readonly IOverlappingBusinessRolesRuleService _overlappingBusinessRolesRuleService;
        private readonly IAllowedGridAreasRuleService _allowedGridAreasRuleService;
        private readonly IExternalActorSynchronizationRepository _externalActorSynchronizationRepository;
        private readonly IUniqueMarketRoleGridAreaService _uniqueMarketRoleGridAreaService;
        private readonly ICombinationOfBusinessRolesRuleService _combinationOfBusinessRolesRuleService;
        private readonly IActorStatusMarketRolesRuleService _actorStatusMarketRolesRuleService;

        public UpdateActorHandler(
            IOrganizationRepository organizationRepository,
            IOrganizationExistsHelperService organizationExistsHelperService,
            IUnitOfWorkProvider unitOfWorkProvider,
            IChangesToActorHelper changesToActorHelper,
            IActorIntegrationEventsQueueService actorIntegrationEventsQueueService,
            IOverlappingBusinessRolesRuleService overlappingBusinessRolesRuleService,
            IAllowedGridAreasRuleService allowedGridAreasRuleService,
            IExternalActorSynchronizationRepository externalActorSynchronizationRepository,
            IUniqueMarketRoleGridAreaService uniqueMarketRoleGridAreaService,
            ICombinationOfBusinessRolesRuleService combinationOfBusinessRolesRuleService,
            IActorStatusMarketRolesRuleService actorStatusMarketRolesRuleService)
        {
            _organizationRepository = organizationRepository;
            _organizationExistsHelperService = organizationExistsHelperService;
            _unitOfWorkProvider = unitOfWorkProvider;
            _changesToActorHelper = changesToActorHelper;
            _actorIntegrationEventsQueueService = actorIntegrationEventsQueueService;
            _overlappingBusinessRolesRuleService = overlappingBusinessRolesRuleService;
            _allowedGridAreasRuleService = allowedGridAreasRuleService;
            _externalActorSynchronizationRepository = externalActorSynchronizationRepository;
            _uniqueMarketRoleGridAreaService = uniqueMarketRoleGridAreaService;
            _combinationOfBusinessRolesRuleService = combinationOfBusinessRolesRuleService;
            _actorStatusMarketRolesRuleService = actorStatusMarketRolesRuleService;
        }

        public async Task<Unit> Handle(UpdateActorCommand request, CancellationToken cancellationToken)
        {
            ArgumentNullException.ThrowIfNull(request, nameof(request));

            var organization = await _organizationExistsHelperService
                .EnsureOrganizationExistsAsync(request.OrganizationId)
                .ConfigureAwait(false);

            var actorId = request.ActorId;
            var actor = organization.Actors.SingleOrDefault(actor => actor.Id == actorId) ?? throw new NotFoundValidationException(actorId);

            var actorChangedIntegrationEvents = await _changesToActorHelper
                .FindChangesMadeToActorAsync(organization.Id, actor, request)
                .ConfigureAwait(false);

            UpdateActorStatus(actor, request);
            UpdateActorName(actor, request);
            UpdateActorMarketRolesAndChildren(organization, actor, request);

            await _uniqueMarketRoleGridAreaService.EnsureUniqueMarketRolesPerGridAreaAsync(actor).ConfigureAwait(false);

            var allMarketRolesForActorGln = organization.Actors
                .Where(x => x.ActorNumber == actor.ActorNumber)
                .SelectMany(x => x.MarketRoles)
                .Select(x => x.Function);

            _combinationOfBusinessRolesRuleService.ValidateCombinationOfBusinessRoles(allMarketRolesForActorGln);

            await _actorStatusMarketRolesRuleService.ValidateAsync(organization.Id, actor).ConfigureAwait(false);

            var uow = await _unitOfWorkProvider
                .NewUnitOfWorkAsync()
                .ConfigureAwait(false);

            await using (uow.ConfigureAwait(false))
            {
                await _organizationRepository
                    .AddOrUpdateAsync(organization)
                    .ConfigureAwait(false);

                await _externalActorSynchronizationRepository
                    .ScheduleAsync(organization.Id, actor.Id)
                    .ConfigureAwait(false);

                await _actorIntegrationEventsQueueService
                    .EnqueueActorUpdatedEventAsync(organization.Id, actor)
                    .ConfigureAwait(false);

                await _actorIntegrationEventsQueueService
                    .EnqueueActorUpdatedEventAsync(organization.Id, actor.Id, actorChangedIntegrationEvents)
                    .ConfigureAwait(false);

                await uow.CommitAsync().ConfigureAwait(false);
            }

            return Unit.Value;
        }

        private static void UpdateActorName(Domain.Model.Actor actor, UpdateActorCommand request)
        {
            actor.Name = new ActorName(request.ChangeActor.Name.Value);
        }

        private static void UpdateActorStatus(Domain.Model.Actor actor, UpdateActorCommand request)
        {
            actor.Status = Enum.Parse<ActorStatus>(request.ChangeActor.Status, true);
        }

        private void UpdateActorMarketRolesAndChildren(Domain.Model.Organization organization, Domain.Model.Actor actor, UpdateActorCommand request)
        {
            actor.MarketRoles.Clear();

            foreach (var marketRole in MarketRoleMapper.Map(request.ChangeActor.MarketRoles))
            {
                actor.MarketRoles.Add(marketRole);
            }

            _overlappingBusinessRolesRuleService.ValidateRolesAcrossActors(organization.Actors);
            _allowedGridAreasRuleService.ValidateGridAreas(actor.MarketRoles);
        }
    }
}
