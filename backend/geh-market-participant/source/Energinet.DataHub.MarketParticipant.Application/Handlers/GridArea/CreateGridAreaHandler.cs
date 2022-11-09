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
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using MediatR;

namespace Energinet.DataHub.MarketParticipant.Application.Handlers.GridArea
{
    public sealed class CreateGridAreaHandler : IRequestHandler<CreateGridAreaCommand, CreateGridAreaResponse>
    {
        private readonly IGridAreaFactoryService _gridAreaFactoryService;

        public CreateGridAreaHandler(IGridAreaFactoryService gridAreaFactoryService)
        {
            _gridAreaFactoryService = gridAreaFactoryService;
        }

        public async Task<CreateGridAreaResponse> Handle(CreateGridAreaCommand request, CancellationToken cancellationToken)
        {
            ArgumentNullException.ThrowIfNull(request, nameof(request));

            var gridArea = await _gridAreaFactoryService
                .CreateAsync(
                    new GridAreaCode(request.GridArea.Code),
                    new GridAreaName(request.GridArea.Name),
                    Enum.Parse<PriceAreaCode>(request.GridArea.PriceAreaCode, true))
                .ConfigureAwait(false);

            return new CreateGridAreaResponse(gridArea.Id);
        }
    }
}
