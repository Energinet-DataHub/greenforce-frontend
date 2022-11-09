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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Common.SimpleInjector;
using SimpleInjector;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Common.SimpleInjector
{
    [UnitTest]
    public sealed class SimpleInjectorScopedRequestTests
    {
        [Fact]
        public async Task Invoke_AllArgumentsCorrectlyProvided_NextCalled()
        {
            // Arrange
            var nextCalled = false;
            await using var container = new Container();
            var target = new SimpleInjectorScopedRequest(container);

            // Act
            await target.Invoke(new MockedFunctionContext(), _ => Task.FromResult(nextCalled = true)).ConfigureAwait(false);

            // Assert
            Assert.True(nextCalled);
        }

        [Fact]
        public async Task Invoke_ContextIsNull_Throws()
        {
            // Arrange
            await using var container = new Container();
            var target = new SimpleInjectorScopedRequest(container);

            // Act + Assert
            await Assert.ThrowsAsync<ArgumentNullException>(() => target.Invoke(null!, _ => Task.CompletedTask))
                .ConfigureAwait(false);
        }

        [Fact]
        public async Task Invoke_NextIsNUll_Throws()
        {
            // Arrange
            await using var container = new Container();
            var target = new SimpleInjectorScopedRequest(container);

            // Act + Assert
            await Assert.ThrowsAsync<ArgumentNullException>(() => target.Invoke(new MockedFunctionContext(), null!))
                .ConfigureAwait(false);
        }
    }
}
