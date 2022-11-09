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
using Energinet.DataHub.MarketParticipant.Domain.Exception;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using MediatR;

namespace Energinet.DataHub.MarketParticipant.Application.Handlers.GridArea
{
    public sealed class GetGridAreaHandler : IRequestHandler<GetGridAreaCommand, GetGridAreaResponse>
    {
        private readonly IGridAreaRepository _repository;

        public GetGridAreaHandler(IGridAreaRepository repository)
        {
            _repository = repository;
        }

        public async Task<GetGridAreaResponse> Handle(GetGridAreaCommand request, CancellationToken cancellationToken)
        {
            ArgumentNullException.ThrowIfNull(request, nameof(request));

            var gridArea = await _repository.GetAsync(new GridAreaId(request.Id)).ConfigureAwait(false);

            return gridArea switch
            {
                null => throw new NotFoundValidationException(request.Id),
                _ => new GetGridAreaResponse(new GridAreaDto(
                    gridArea.Id.Value,
                    gridArea.Code.Value,
                    gridArea.Name.Value,
                    gridArea.PriceAreaCode.ToString(),
                    gridArea.ValidFrom,
                    gridArea.ValidTo))
            };
        }
    }
}
