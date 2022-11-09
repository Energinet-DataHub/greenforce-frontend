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
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Domain.Services.Rules;

namespace Energinet.DataHub.MarketParticipant.Domain.Services;

public sealed class ActorFactoryService : IActorFactoryService
{
    private readonly IOrganizationRepository _organizationRepository;
    private readonly IUnitOfWorkProvider _unitOfWorkProvider;
    private readonly IActorIntegrationEventsQueueService _actorIntegrationEventsQueueService;
    private readonly IOverlappingBusinessRolesRuleService _overlappingBusinessRolesRuleService;
    private readonly IUniqueGlobalLocationNumberRuleService _uniqueGlobalLocationNumberRuleService;
    private readonly IAllowedGridAreasRuleService _allowedGridAreasRuleService;

    public ActorFactoryService(
        IOrganizationRepository organizationRepository,
        IUnitOfWorkProvider unitOfWorkProvider,
        IActorIntegrationEventsQueueService actorIntegrationEventsQueueService,
        IOverlappingBusinessRolesRuleService overlappingBusinessRolesRuleService,
        IUniqueGlobalLocationNumberRuleService uniqueGlobalLocationNumberRuleService,
        IAllowedGridAreasRuleService allowedGridAreasRuleService)
    {
        _organizationRepository = organizationRepository;
        _unitOfWorkProvider = unitOfWorkProvider;
        _actorIntegrationEventsQueueService = actorIntegrationEventsQueueService;
        _overlappingBusinessRolesRuleService = overlappingBusinessRolesRuleService;
        _uniqueGlobalLocationNumberRuleService = uniqueGlobalLocationNumberRuleService;
        _allowedGridAreasRuleService = allowedGridAreasRuleService;
    }

    public async Task<Actor> CreateAsync(
        Organization organization,
        ActorNumber actorNumber,
        ActorName actorName,
        IReadOnlyCollection<ActorMarketRole> marketRoles)
    {
        ArgumentNullException.ThrowIfNull(organization);
        ArgumentNullException.ThrowIfNull(actorNumber);
        ArgumentNullException.ThrowIfNull(marketRoles);

        await _uniqueGlobalLocationNumberRuleService
            .ValidateGlobalLocationNumberAvailableAsync(organization, actorNumber)
            .ConfigureAwait(false);

        _allowedGridAreasRuleService.ValidateGridAreas(marketRoles);

        var newActor = new Actor(actorNumber) { Name = actorName };

        foreach (var marketRole in marketRoles)
            newActor.MarketRoles.Add(marketRole);

        organization.Actors.Add(newActor);

        _overlappingBusinessRolesRuleService.ValidateRolesAcrossActors(organization.Actors);

        var uow = await _unitOfWorkProvider
            .NewUnitOfWorkAsync()
            .ConfigureAwait(false);

        var savedActor = await SaveActorAsync(organization, newActor).ConfigureAwait(false);

        await _actorIntegrationEventsQueueService
            .EnqueueActorUpdatedEventAsync(organization.Id, savedActor)
            .ConfigureAwait(false);

        await _actorIntegrationEventsQueueService
            .EnqueueActorCreatedEventsAsync(organization.Id, savedActor)
            .ConfigureAwait(false);

        await uow.CommitAsync().ConfigureAwait(false);

        return savedActor;
    }

    private async Task<Actor> SaveActorAsync(Organization organization, Actor newActor)
    {
        await _organizationRepository
            .AddOrUpdateAsync(organization)
            .ConfigureAwait(false);

        var savedOrganization = await _organizationRepository
            .GetAsync(organization.Id)
            .ConfigureAwait(false);

        return savedOrganization!
            .Actors
            .Single(actor => actor.Id == newActor.Id);
    }
}
