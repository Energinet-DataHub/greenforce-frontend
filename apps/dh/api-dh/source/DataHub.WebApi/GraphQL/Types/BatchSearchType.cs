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

using Energinet.DataHub.WebApi.Clients.Wholesale.v2_1;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using GraphQL.Types;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class BatchSearchType : ObjectGraphType<BatchSearchDtoV2>
    {
        public BatchSearchType()
        {
            Name = "BatchSearch";
            Field(x => x.PeriodEnd);
            Field(x => x.PeriodStart);
            Field(x => x.MaxExecutionTime);
            Field(x => x.MinExecutionTime);
            Field(x => x.FilterByExecutionState);
            Field(x => x.FilterByGridAreaCodes);
        }
    }
}
