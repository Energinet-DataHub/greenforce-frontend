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
    public class CreateCalculationInputType : InputObjectGraphType<CreateCalculationInput>
    {
        public CreateCalculationInputType()
        {
            Name = "CreateCalculationInput";
            Field(x => x.Period).Description("The period for the calculation.");
            Field(x => x.ProcessType).Description("The process type for the calculation.");
            Field<NonNullGraphType<ListGraphType<NonNullGraphType<StringGraphType>>>>("gridAreaCodes")
                .Resolve(x => x.Source.GridAreaCodes)
                .Description("The grid areas to be included in the calculation.");
        }
    }
}
