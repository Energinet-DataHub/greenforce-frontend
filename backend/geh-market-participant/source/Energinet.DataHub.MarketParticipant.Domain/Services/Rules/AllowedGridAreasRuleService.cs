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
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Energinet.DataHub.MarketParticipant.Domain.Model;

namespace Energinet.DataHub.MarketParticipant.Domain.Services.Rules
{
    public sealed class AllowedGridAreasRuleService : IAllowedGridAreasRuleService
    {
        private static readonly EicFunction[] _rolesAllowingSingleGridAreaOnly =
        {
            EicFunction.GridAccessProvider,
            EicFunction.MeterAdministrator,
            EicFunction.MeterOperator,
            EicFunction.MeteredDataCollector,
            EicFunction.PartyConnectedToTheGrid
        };

        public void ValidateGridAreas(IEnumerable<ActorMarketRole> marketRoles)
        {
            ArgumentNullException.ThrowIfNull(marketRoles);

            foreach (var marketRole in marketRoles)
            {
                var noOfGridAreas = marketRole.GridAreas.Count;

                var isSingleGridAreaRole = _rolesAllowingSingleGridAreaOnly.Contains(marketRole.Function);
                if (isSingleGridAreaRole && noOfGridAreas > 1)
                {
                    throw new ValidationException($"Only one grid area can be assigned to actor with role '{marketRole.Function}'.");
                }
            }
        }
    }
}
