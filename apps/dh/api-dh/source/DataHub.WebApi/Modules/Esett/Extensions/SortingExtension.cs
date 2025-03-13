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

using EsettSorting = Energinet.DataHub.WebApi.Clients.ESettExchange.v1.SortDirection;
using Sorting = Energinet.DataHub.WebApi.GraphQL.Enums.SortDirection;

namespace Energinet.DataHub.WebApi.Modules.Esett.Extensions;

public static class SortingExtensions
{
    public static EsettSorting ToEsettSorting(this Sorting? sorting)
    {
        return sorting switch
        {
            Sorting.Asc => EsettSorting.Ascending,
            Sorting.Desc => EsettSorting.Descending,
            _ => throw new ArgumentOutOfRangeException(nameof(sorting), sorting, null),
        };
    }
}
