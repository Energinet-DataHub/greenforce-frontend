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
using Energinet.DataHub.WebApi.Modules.Common.Models;
using Energinet.DataHub.WebApi.Tests.Helpers;
using Xunit;
using ChargeResolution = Energinet.DataHub.Charges.Abstractions.Shared.ResolutionDto;
using RequestChangeOfPriceListResolution = Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfPriceList.V1.Models.ResolutionV1;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL;

public class EnumerationTests
{
    [Theory]
    [InlineData(typeof(ChargeResolution))]
    public void ResolutionFromNameTests(Type type) =>
        EnumerationTestHelper.TestEnumerationFrom(type, Resolution.FromName);

    [Theory]
    [InlineData(typeof(RequestChangeOfPriceListResolution))]
    public void ResolutionFromDurationTests(Type type) =>
        EnumerationTestHelper.TestEnumerationFrom(type, Resolution.FromDuration);

    [Theory]
    [InlineData(typeof(ChargeResolution))]
    public void ResolutionCastTests(Type type) =>
        EnumerationTestHelper.TestEnumerationCast<Resolution>(type, r => r.Cast(type));

    [Fact]
    public void RequestChangeOfPriceListResolutionCastFromDurationTests() =>
        EnumerationTestHelper.TestEnumerationCast<Resolution>(
            typeof(RequestChangeOfPriceListResolution),
            r => r.CastFromDuration<RequestChangeOfPriceListResolution>());
}
