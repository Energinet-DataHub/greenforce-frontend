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

using Energinet.DataHub.WebApi.Clients.ESettExchange.v1;
using GraphQL.Types;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class ExchangeEventSearchResultType : ObjectGraphType<ExchangeEventSearchResult>
    {
        public ExchangeEventSearchResultType()
        {
            Field(x => x.DocumentId).Description("The id of the found exchanged document.");
            Field(x => x.GridAreaCode).Description("The code of the grid area the document is referencing.");
            Field<ExchangeEventProcessTypeType>("processType")
                .Resolve(x => x.Source.ProcessType)
                .Description("The type of process that generated the calculation results in the document.");
            Field(x => x.DocumentStatus).Description("The delivery status of the document.");
            Field(x => x.TimeSeriesType).Description("The type of calculation result in the document.");
        }
    }
}
