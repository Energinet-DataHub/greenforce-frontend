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

using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Tests.TestServices;
using HotChocolate.Types;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Charges;

public class ChargeResolutionSchemaTests
{
    [Fact]
    public async Task CreateChargeInput_Resolution_UsesChargeResolutionInputType()
    {
        var schema = await new GraphQLTestService().GetSchemaAsync();
        var inputType = schema.GetType<InputObjectType>("CreateChargeInput");
        var resolutionField = inputType.Fields["resolution"];
        Assert.Equal("ChargeResolutionInput", resolutionField.Type.NamedType().Name);
    }

    [Fact]
    public async Task ChargeOverviewQueryInput_Resolution_UsesChargeResolutionInputType()
    {
        var schema = await new GraphQLTestService().GetSchemaAsync();
        var inputType = schema.GetType<InputObjectType>("ChargeOverviewQueryInput");
        var resolutionField = inputType.Fields["resolution"];
        Assert.Equal("ChargeResolutionInput", resolutionField.Type.NamedType().Name);
    }
}
