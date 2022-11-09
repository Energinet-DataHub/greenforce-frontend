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

namespace Energinet.DataHub.MarketParticipant.Domain.Model
{
    public class ActorMarketRole
    {
        public ActorMarketRole(Guid id, EicFunction eic, IEnumerable<ActorGridArea> gridAreas, string? comment)
        {
            Id = id;
            GridAreas = gridAreas.ToList();
            Function = eic;
            Comment = comment;
        }

        public ActorMarketRole(EicFunction eic, IEnumerable<ActorGridArea> gridAreas, string? comment)
        {
            GridAreas = gridAreas.ToList();
            Function = eic;
            Comment = comment;
        }

        public ActorMarketRole(Guid id, EicFunction eic, string? comment)
        {
            Id = id;
            Function = eic;
            GridAreas = new List<ActorGridArea>();
            Comment = comment;
        }

        public ActorMarketRole(Guid id, EicFunction eic, IEnumerable<ActorGridArea> gridAreas)
        {
            Id = id;
            GridAreas = gridAreas.ToList();
            Function = eic;
        }

        public ActorMarketRole(EicFunction eic, IEnumerable<ActorGridArea> gridAreas)
        {
            GridAreas = gridAreas.ToList();
            Function = eic;
        }

        public ActorMarketRole(Guid id, EicFunction eic)
        {
            Id = id;
            Function = eic;
            GridAreas = new List<ActorGridArea>();
        }

        public Guid Id { get; }
        public ICollection<ActorGridArea> GridAreas { get; }
        public EicFunction Function { get; }
        public string? Comment { get; }
    }
}
