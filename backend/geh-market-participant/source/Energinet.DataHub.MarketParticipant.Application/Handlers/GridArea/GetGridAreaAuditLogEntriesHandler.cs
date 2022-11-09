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
using Energinet.DataHub.MarketParticipant.Application.Commands.GridArea;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using MediatR;
using GridAreaAuditLogEntryField = Energinet.DataHub.MarketParticipant.Application.Commands.GridArea.GridAreaAuditLogEntryField;

namespace Energinet.DataHub.MarketParticipant.Application.Handlers.GridArea
{
    public sealed class GetGridAreaAuditLogEntriesHandler : IRequestHandler<GetGridAreaAuditLogEntriesCommand, GetGridAreaAuditLogEntriesResponse>
    {
        private readonly IGridAreaAuditLogEntryRepository _repository;
        private readonly IUserDisplayNameProvider _userDisplayNameProvider;

        public GetGridAreaAuditLogEntriesHandler(IGridAreaAuditLogEntryRepository repository, IUserDisplayNameProvider userDisplayNameProvider)
        {
            _repository = repository;
            _userDisplayNameProvider = userDisplayNameProvider;
        }

        public async Task<GetGridAreaAuditLogEntriesResponse> Handle(GetGridAreaAuditLogEntriesCommand request, CancellationToken cancellationToken)
        {
            ArgumentNullException.ThrowIfNull(request, nameof(request));

            var entries = (await _repository.GetAsync(new GridAreaId(request.GridAreaId)).ConfigureAwait(false)).ToList();

            var users = (await _userDisplayNameProvider.GetUserDisplayNamesAsync(entries.Select(x => x.UserId)).ConfigureAwait(false))
                .ToDictionary(x => x.Id, x => x.Value);

            return new GetGridAreaAuditLogEntriesResponse(
                entries.Select(
                    x => new GridAreaAuditLogEntryDto(
                        x.Timestamp,
                        users.TryGetValue(x.UserId, out var userDisplayName) ? userDisplayName : null,
                        (GridAreaAuditLogEntryField)x.Field,
                        x.OldValue,
                        x.NewValue,
                        x.GridAreaId)));
        }
    }
}
