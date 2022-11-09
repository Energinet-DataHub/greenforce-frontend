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
using System.Linq;
using Energinet.DataHub.MarketParticipant.Integration.Model.Exceptions;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Libraries.Tests.Exceptions
{
    [UnitTest]
    public class ExceptionTests
    {
        [Fact]
        public void Ctor_Exists_IsCalledSuccessfully()
        {
            // arrange
            var expectedCount = typeof(MarketParticipantException).Assembly.GetTypes()
                .Count(x => x.IsAssignableTo(typeof(Exception))) * 3;

            var exceptionCtors = new Action[]
            {
#pragma warning disable CA1806
                // ReSharper disable ObjectCreationAsStatement
                () => new MarketParticipantException(),
                () => new MarketParticipantException("message"),
                () => new MarketParticipantException("message", new InvalidOperationException()),
                // ReSharper restore ObjectCreationAsStatement
#pragma warning restore CA1806
            };

            // act
            foreach (var ctor in exceptionCtors)
            {
                ctor();
            }

            // assert
            Assert.True(
                expectedCount == exceptionCtors.Length,
                "Expected number of invoked exception constructos differs from actual count. Have new exception types been added? :)");
        }
    }
}
