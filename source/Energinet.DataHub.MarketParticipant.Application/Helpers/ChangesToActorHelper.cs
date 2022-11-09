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
using Energinet.DataHub.MarketParticipant.Application.Commands.Actor;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents.ActorIntegrationEvents;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents.GridAreaIntegrationEvents;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Domain.Services;

namespace Energinet.DataHub.MarketParticipant.Application.Helpers;

public sealed class ChangesToActorHelper : IChangesToActorHelper
{
    private readonly List<IIntegrationEvent> _changeEvents = new();
    private readonly IBusinessRoleCodeDomainService _businessRoleCodeDomainService;
    private readonly IGridAreaLinkRepository _gridAreaLinkRepository;

    public ChangesToActorHelper(
        IBusinessRoleCodeDomainService businessRoleCodeDomainService,
        IGridAreaLinkRepository gridAreaLinkRepository)
    {
        _businessRoleCodeDomainService = businessRoleCodeDomainService;
        _gridAreaLinkRepository = gridAreaLinkRepository;
    }

    public async Task<List<IIntegrationEvent>> FindChangesMadeToActorAsync(OrganizationId organizationId, Actor existingActor, UpdateActorCommand incomingActor)
    {
        ArgumentNullException.ThrowIfNull(organizationId, nameof(organizationId));
        ArgumentNullException.ThrowIfNull(existingActor, nameof(existingActor));
        ArgumentNullException.ThrowIfNull(incomingActor, nameof(incomingActor));

        AddChangeEventIfActorStatusChanged(organizationId, existingActor, incomingActor.ChangeActor.Status);
        AddChangeEventIfActorNameChanged(organizationId, existingActor, incomingActor.ChangeActor.Name);
        await AddChangeEventsIfMarketRolesOrChildrenChangedAsync(organizationId, existingActor, incomingActor.ChangeActor.MarketRoles).ConfigureAwait(false);

        return _changeEvents;
    }

    private void AddChangeEventIfActorStatusChanged(OrganizationId organizationId, Actor existingActor, string incomingStatus)
    {
        var newStatus = Enum.Parse<ActorStatus>(incomingStatus);
        if (existingActor.Status != newStatus)
        {
            _changeEvents.Add(new ActorStatusChangedIntegrationEvent
            {
                OrganizationId = organizationId,
                ActorId = existingActor.Id,
                Status = newStatus
            });
        }
    }

    private void AddChangeEventIfActorNameChanged(OrganizationId organizationId, Actor existingActor, ActorNameDto incomingName)
    {
        var newName = incomingName.Value.Trim();
        if (existingActor.Name.Value.Trim() != newName)
        {
            _changeEvents.Add(new ActorNameChangedIntegrationEvent
            {
                OrganizationId = organizationId,
                ActorId = existingActor.Id,
                Name = new ActorName(newName)
            });
        }
    }

    private async Task AddChangeEventsIfMarketRolesOrChildrenChangedAsync(
        OrganizationId organizationId,
        Actor existingActor,
        IEnumerable<ActorMarketRoleDto> incomingMarketRoles)
    {
        var existingEicFunctions = existingActor
            .MarketRoles
            .Select(marketRole => marketRole.Function)
            .ToList();

        var incomingEicFunctions = incomingMarketRoles
            .Select(marketRole => Enum.Parse<EicFunction>(marketRole.EicFunction))
            .ToList();

        var eicFunctionsToRemoveFromActor = existingEicFunctions.Except(incomingEicFunctions);

        var eicFunctionsToAddToActor = incomingEicFunctions.Except(existingEicFunctions);

        // Loop over each market role that did not change to see if children of the market role have changed
        foreach (var existingEicFunction in existingEicFunctions)
        {
            if (incomingEicFunctions.Contains(existingEicFunction))
            {
                var existingGridAreas = existingActor
                    .MarketRoles
                    .First(marketRole => marketRole.Function == existingEicFunction)
                    .GridAreas;

                var incomingGridAreas = incomingMarketRoles
                    .First(marketRole => Enum.Parse<EicFunction>(marketRole.EicFunction) == existingEicFunction)
                    .GridAreas;

                var marketRole = new ActorMarketRole(existingActor.Id, existingEicFunction, existingGridAreas);

                await AddChangeEventsIfGridAreasChangedAsync(organizationId, existingActor.Id, marketRole, incomingGridAreas).ConfigureAwait(false);
            }
        }

        foreach (var eicFunction in eicFunctionsToRemoveFromActor)
        {
            var gridAreas = existingActor.MarketRoles.First(marketRole => marketRole.Function == eicFunction).GridAreas;
            var marketRole = new ActorMarketRole(existingActor.Id, eicFunction, gridAreas);

            _changeEvents.Add(new MarketRoleRemovedFromActorIntegrationEvent
            {
                OrganizationId = organizationId,
                ActorId = existingActor.Id,
                BusinessRole = _businessRoleCodeDomainService.GetBusinessRoleCodes(new List<EicFunction> { marketRole.Function }).FirstOrDefault(),
                MarketRole = marketRole.Function
            });

            await AddChangeEventsForRemovedGridAreasAsync(organizationId, existingActor.Id, eicFunction, gridAreas).ConfigureAwait(false);
        }

        foreach (var eicFunction in eicFunctionsToAddToActor)
        {
            var gridAreas = incomingMarketRoles.First(marketRole => Enum.Parse<EicFunction>(marketRole.EicFunction) == eicFunction).GridAreas;
            var marketRole = new ActorMarketRole(existingActor.Id, eicFunction, gridAreas.Select(gridArea => new ActorGridArea(gridArea.Id, gridArea.MeteringPointTypes.Select(meteringPointType => Enum.Parse<MeteringPointType>(meteringPointType)))));

            _changeEvents.Add(new MarketRoleAddedToActorIntegrationEvent
            {
                OrganizationId = organizationId,
                ActorId = existingActor.Id,
                BusinessRole = _businessRoleCodeDomainService.GetBusinessRoleCodes(new List<EicFunction> { marketRole.Function }).FirstOrDefault(),
                MarketRole = marketRole.Function
            });

            await AddChangeEventsForAddedGridAreasAsync(
                organizationId,
                existingActor.Id,
                eicFunction,
                gridAreas.Select(gridArea => new ActorGridArea(
                    gridArea.Id,
                    gridArea.MeteringPointTypes.Select(meteringPointType => Enum.Parse<MeteringPointType>(meteringPointType))))).ConfigureAwait(false);
        }
    }

    private async Task AddChangeEventsIfGridAreasChangedAsync(OrganizationId organizationId, Guid existingActorId, ActorMarketRole existingMarketRole, IEnumerable<ActorGridAreaDto> incomingGridAreas)
    {
        var incomingActorGridAreaDtos = incomingGridAreas.ToList();
        var incomingActorGridAreas = incomingActorGridAreaDtos.Select(gridArea => gridArea.Id).ToList();

        var gridAreaIdsToAddToActor = incomingActorGridAreas.Except(existingMarketRole.GridAreas.Select(gridArea => gridArea.Id));
        var gridAreasToAddToActor = gridAreaIdsToAddToActor
            .Select(id =>
                new ActorGridArea(
                    id,
                    incomingActorGridAreaDtos.First(x => x.Id == id).MeteringPointTypes.Select(x => Enum.Parse<MeteringPointType>(x, false))));

        var gridAreaIdsToRemoveFromActor = existingMarketRole
            .GridAreas
            .Select(gridArea => gridArea.Id)
            .Except(incomingActorGridAreas);

        var gridAreasToRemoveFromActor = gridAreaIdsToRemoveFromActor
            .Select(id =>
                new ActorGridArea(
                    id,
                    existingMarketRole.GridAreas.First(x => x.Id == id).MeteringPointTypes.Select(x => x)));

        await AddChangeEventsForAddedGridAreasAsync(organizationId, existingActorId, existingMarketRole.Function, gridAreasToAddToActor).ConfigureAwait(false);
        await AddChangeEventsForRemovedGridAreasAsync(organizationId, existingActorId, existingMarketRole.Function, gridAreasToRemoveFromActor).ConfigureAwait(false);

        foreach (var gridArea in existingMarketRole.GridAreas)
        {
            if (incomingActorGridAreaDtos.FirstOrDefault(x => x.Id == gridArea.Id) is ActorGridAreaDto incomingDto)
            {
                AddChangeEventsIfMeteringPointTypeChanged(
                    organizationId,
                    existingActorId,
                    existingMarketRole.Function,
                    gridArea,
                    incomingDto.MeteringPointTypes.Select(x => Enum.Parse<MeteringPointType>(x, false)));
            }
        }
    }

    private void AddChangeEventsIfMeteringPointTypeChanged(
        OrganizationId organizationId,
        Guid existingActorId,
        EicFunction function,
        ActorGridArea existingGridArea,
        IEnumerable<MeteringPointType> incomingMeteringPointTypes)
    {
        var meteringPointTypes = incomingMeteringPointTypes.ToList();
        var meteringPointTypesToAddToActor = meteringPointTypes.Except(existingGridArea.MeteringPointTypes);
        var meteringPointTypesToRemoveFromActor = existingGridArea.MeteringPointTypes.Except(meteringPointTypes);

        AddChangeEventsForAddedMeteringPointTypes(
            organizationId,
            existingActorId,
            function,
            existingGridArea.Id,
            meteringPointTypesToAddToActor);

        AddChangeEventsForRemovedMeteringPointTypes(
            organizationId,
            existingActorId,
            function,
            existingGridArea.Id,
            meteringPointTypesToRemoveFromActor);
    }

    private async Task AddChangeEventsForAddedGridAreasAsync(OrganizationId organizationId, Guid existingActorId, EicFunction function, IEnumerable<ActorGridArea> gridAreas)
    {
        foreach (var gridArea in gridAreas)
        {
            var gridAreaLink = await _gridAreaLinkRepository.GetAsync(new GridAreaId(gridArea.Id)).ConfigureAwait(false);
            if (gridAreaLink is null)
            {
                throw new InvalidOperationException(
                    $"Could not find an associated link id with the specified grid area id: {gridArea.Id}");
            }

            _changeEvents.Add(new GridAreaAddedToActorIntegrationEvent
            {
                OrganizationId = organizationId,
                ActorId = existingActorId,
                Function = function,
                GridAreaId = gridArea.Id,
                GridAreaLinkId = gridAreaLink.Id.Value
            });

            AddChangeEventsForAddedMeteringPointTypes(
                organizationId,
                existingActorId,
                function,
                gridArea.Id,
                gridArea.MeteringPointTypes);
        }
    }

    private void AddChangeEventsForAddedMeteringPointTypes(
        OrganizationId organizationId,
        Guid existingActorId,
        EicFunction function,
        Guid gridAreaId,
        IEnumerable<MeteringPointType> gridAreaMeteringPointTypes)
    {
        foreach (var meteringPointType in gridAreaMeteringPointTypes)
        {
            _changeEvents.Add(new MeteringPointTypeAddedToActorIntegrationEvent
            {
                OrganizationId = organizationId,
                ActorId = existingActorId,
                Function = function,
                GridAreaId = gridAreaId,
                Type = meteringPointType
            });
        }
    }

    private async Task AddChangeEventsForRemovedGridAreasAsync(OrganizationId organizationId, Guid existingActorId, EicFunction function, IEnumerable<ActorGridArea> gridAreas)
    {
        foreach (var gridArea in gridAreas)
        {
            var gridAreaLink = await _gridAreaLinkRepository.GetAsync(new GridAreaId(gridArea.Id)).ConfigureAwait(false);
            if (gridAreaLink is null)
            {
                throw new InvalidOperationException(
                    $"Could not find an associated link id with the specified grid area id: {gridArea.Id}");
            }

            _changeEvents.Add(new GridAreaRemovedFromActorIntegrationEvent
            {
                OrganizationId = organizationId,
                ActorId = existingActorId,
                Function = function,
                GridAreaId = gridArea.Id,
                GridAreaLinkId = gridAreaLink.Id.Value
            });

            AddChangeEventsForRemovedMeteringPointTypes(
                organizationId,
                existingActorId,
                function,
                gridArea.Id,
                gridArea.MeteringPointTypes);
        }
    }

    private void AddChangeEventsForRemovedMeteringPointTypes(
        OrganizationId organizationId,
        Guid existingActorId,
        EicFunction function,
        Guid gridAreaId,
        IEnumerable<MeteringPointType> gridAreaMeteringPointTypes)
    {
        foreach (var meteringPointType in gridAreaMeteringPointTypes)
        {
            _changeEvents.Add(new MeteringPointTypeRemovedFromActorIntegrationEvent
            {
                OrganizationId = organizationId,
                ActorId = existingActorId,
                Function = function,
                GridAreaId = gridAreaId,
                Type = meteringPointType
            });
        }
    }
}
