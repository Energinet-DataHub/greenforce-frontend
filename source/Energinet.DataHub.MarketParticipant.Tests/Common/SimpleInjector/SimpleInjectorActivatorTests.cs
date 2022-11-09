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
    public sealed class SimpleInjectorActivatorTests
    {
        /// <summary>
        /// For testing only.
        /// </summary>
        private interface IFoo
        {
        }

        [Fact]
        public async Task CreateInstance_AllArgumentsCorrectlyProvided_InstanceIsCreated()
        {
            // Arrange
            await using var container = new Container();
            container.Register<IFoo>(() => new Foo());

            var target = new SimpleInjectorActivator(container);

            // Act
            var actual = target.CreateInstance(typeof(IFoo), new MockedFunctionContext());

            // Assert
            Assert.NotNull(actual);
            Assert.IsType<Foo>(actual);
        }

        [Fact]
        public async Task CreateInstance_InstanceTypeIsNull_Throws()
        {
            // Arrange
            await using var container = new Container();
            container.Register<IFoo>(() => new Foo());

            var target = new SimpleInjectorActivator(container);

            // Act + Assert
            Assert.Throws<ArgumentNullException>(() => target.CreateInstance(null!, new MockedFunctionContext()));
        }

        private sealed class Foo : IFoo
        {
        }
    }
}
