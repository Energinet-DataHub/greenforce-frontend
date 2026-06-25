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

using System.Collections.Generic;
using System.Reflection;
using Energinet.DataHub.ProcessManager.Abstractions.Core.ValueObjects;
using Energinet.DataHub.WebApi.Modules.Processes.MoveIn.Client;
using FluentAssertions;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Modules.Processes.MoveIn;

public class MoveInTemporaryStorageBusinessReasonTests
{
    [Fact]
    public void AllowedTemporaryStorageBusinessReasons_IncludesSecondaryMoveIn()
    {
        // Arrange
        var field = typeof(MoveInClient).GetField(
            "AllowedTemporaryStorageBusinessReasons",
            BindingFlags.NonPublic | BindingFlags.Static);

        // Act
        var allowedBusinessReasons = field?.GetValue(null) as IReadOnlySet<BusinessReason>;

        // Assert
        allowedBusinessReasons.Should().NotBeNull();
        allowedBusinessReasons!.Should().Contain(BusinessReason.SecondaryMoveIn);
    }
}
