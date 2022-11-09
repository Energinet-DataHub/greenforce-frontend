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
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Application.Commands.GridArea;
using Energinet.DataHub.MarketParticipant.Domain;
using Energinet.DataHub.MarketParticipant.Domain.Exception;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using MediatR;
using GridAreaAuditLogEntryField = Energinet.DataHub.MarketParticipant.Domain.Model.GridAreaAuditLogEntryField;

namespace Energinet.DataHub.MarketParticipant.Application.Handlers.GridArea
{
    public sealed class UpdateGridAreaHandler : IRequestHandler<UpdateGridAreaCommand>
    {
        private readonly IGridAreaRepository _gridAreaRepository;
        private readonly IGridAreaIntegrationEventsQueueService _gridAreaIntegrationEventsQueueService;
        private readonly IUnitOfWorkProvider _unitOfWorkProvider;
        private readonly IGridAreaAuditLogEntryRepository _gridAreaAuditLogEntryRepository;
        private readonly IUserIdProvider _userIdProvider;

        public UpdateGridAreaHandler(
            IGridAreaRepository gridAreaRepository,
            IGridAreaIntegrationEventsQueueService gridAreaIntegrationEventsQueueService,
            IUnitOfWorkProvider unitOfWorkProvider,
            IGridAreaAuditLogEntryRepository gridAreaAuditLogEntryRepository,
            IUserIdProvider userIdProvider)
        {
            _gridAreaRepository = gridAreaRepository;
            _gridAreaIntegrationEventsQueueService = gridAreaIntegrationEventsQueueService;
            _unitOfWorkProvider = unitOfWorkProvider;
            _gridAreaAuditLogEntryRepository = gridAreaAuditLogEntryRepository;
            _userIdProvider = userIdProvider;
        }

        public async Task<Unit> Handle(UpdateGridAreaCommand request, CancellationToken cancellationToken)
        {
            ArgumentNullException.ThrowIfNull(request, nameof(request));

            var uow = await _unitOfWorkProvider.NewUnitOfWorkAsync().ConfigureAwait(false);

            await using (uow.ConfigureAwait(false))
            {
                // Get from db
                var gridArea = await _gridAreaRepository.GetAsync(new GridAreaId(request.Id)).ConfigureAwait(false) ??
                    throw new NotFoundValidationException(request.Id);

                // Event should be sent
                var nameChanged = gridArea.Name.Value != request.GridAreaDto.Name;

                // update and send events
                if (nameChanged)
                {
                    var updatedGridArea = new Domain.Model.GridArea(gridArea.Id, new GridAreaName(request.GridAreaDto.Name), gridArea.Code, gridArea.PriceAreaCode);

                    await _gridAreaRepository.AddOrUpdateAsync(updatedGridArea).ConfigureAwait(false);
                    await CreateLogEntryAsync(gridArea.Id.Value, GridAreaAuditLogEntryField.Name, gridArea.Name.Value, updatedGridArea.Name.Value).ConfigureAwait(false);
                    await _gridAreaIntegrationEventsQueueService
                        .EnqueueGridAreaNameChangedEventAsync(updatedGridArea)
                        .ConfigureAwait(false);
                }

                await uow.CommitAsync().ConfigureAwait(false);

                return Unit.Value;
            }
        }

        private async Task CreateLogEntryAsync(Guid gridAreaId, GridAreaAuditLogEntryField field, string oldvalue, string newValue)
        {
            await _gridAreaAuditLogEntryRepository.InsertAsync(
                new GridAreaAuditLogEntry(
                    DateTimeOffset.UtcNow,
                    _userIdProvider.UserId,
                    field,
                    oldvalue,
                    newValue,
                    gridAreaId)).ConfigureAwait(false);
        }
    }
}
