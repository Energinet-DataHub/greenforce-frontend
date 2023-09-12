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
using GraphQL.Types;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class ESettOutgoingMessageType : ObjectGraphType<ESettOutogingMessage>
    {
        public ESettOutgoingMessageType()
        {
            Field(x => x.DocumentId).Description("The id of the found exchanged document.");
            Field(x => x.Created).Description("The time when the document was generated.");
            Field<NonNullGraphType<GridAreaType>>("gridArea")
               .Resolve(x => x.Source.GridArea)
               .Description("The grid area of the document.");
            Field(x => x.PeriodFrom).Description("The start date and time of the calculation period.");
            Field(x => x.PeriodTo).Description("The end date and time of the calculation period.");
            Field<NonNullGraphType<ExchangeEventProcessTypeType>>("processType")
                .Resolve(x => x.Source.ProcessType)
                .Description("The type of process that generated the calculation results in the document.");
            Field(x => x.DocumentStatus).Description("The delivery status of the document.");
            Field(x => x.TimeSeriesType).Description("The type of calculation result in the document.");
            Field(x => x.DownloadLink).Description("The link to the document.");
        }
    }
}
