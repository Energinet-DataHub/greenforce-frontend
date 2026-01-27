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
using Energinet.DataHub.EDI.B2CClient.Abstractions.ArchivedMessages.V1;
using Energinet.DataHub.EDI.B2CClient.Abstractions.MeteringPointArchivedMessages.V1;
using Energinet.DataHub.WebApi.Modules.Common.Models;
using Energinet.DataHub.WebApi.Modules.Common.Types;
using Energinet.DataHub.WebApi.Tests.Helpers;
using Xunit;
using ChargeResolution = Energinet.DataHub.Charges.Abstractions.Shared.ResolutionDto;
using RequestChangeOfPriceListResolution = Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfPriceList.V1.Models.ResolutionV1;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL;

public class EnumerationTests
{
    [Theory]
    [InlineData(typeof(ChargeResolution))]
    public void FromName_WithValidResolutionName_ReturnsResolution(Type type)
        => EnumerationTestHelper.TestFromName<Resolution>(type);

    [Theory]
    [InlineData(typeof(RequestChangeOfPriceListResolution))]
    public void FromDuration_WithValidDuration_ReturnsResolution(Type type)
        => EnumerationTestHelper.TestCustomFrom(type, Resolution.FromDuration);

    [Theory]
    [InlineData(typeof(ChargeResolution))]
    public void Cast_ToChargeResolution_ReturnsMatchingEnumValue(Type type)
        => EnumerationTestHelper.TestCast<Resolution>(type);

    [Theory]
    [InlineData(typeof(RequestChangeOfPriceListResolution))]
    public void CastDurationTo_ToRequestChangeOfPriceListResolution_ReturnsMatchingEnumValue(Type type)
        => EnumerationTestHelper.TestCustomCast<Resolution>(
            type,
            r => r.CastDurationTo<RequestChangeOfPriceListResolution>());

    [Theory]
    [InlineData(typeof(DocumentTypeDtoV1))]
    [InlineData(typeof(MeteringPointDocumentTypeDtoV1))]
    public void FromName_WithValidDocumentTypeName_ReturnsDocumentType(Type type)
        => EnumerationTestHelper.TestFromName<DocumentType>(type);

    [Theory]
    [InlineData("InvalidName")]
    [InlineData("")]
    public void FromName_WithInvalidName_ThrowsInvalidOperationException(string invalidName)
        => Assert.Throws<InvalidOperationException>(() => DocumentType.FromName(invalidName));

    [Theory]
    [InlineData("InvalidDuration")]
    [InlineData("")]
    public void FromDuration_WithInvalidDuration_ThrowsInvalidOperationException(string invalidDuration)
        => Assert.Throws<InvalidOperationException>(() => Resolution.FromDuration(invalidDuration));

    [Theory]
    [InlineData(typeof(ChargeResolution))]
    public void Cast_WithIncompatibleEnumType_ThrowsArgumentException(Type type)
        => Assert.Throws<ArgumentException>(() => DocumentType.RequestMeasurements.Cast(type));
}
