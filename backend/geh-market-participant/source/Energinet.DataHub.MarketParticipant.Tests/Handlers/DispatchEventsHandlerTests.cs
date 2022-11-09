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
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Application.Commands;
using Energinet.DataHub.MarketParticipant.Application.Handlers;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Handlers
{
    [UnitTest]
    public sealed class DispatchEventsHandlerTests
    {
        [Fact]
        public async Task Handle_NullArgument_ThrowsException()
        {
            // arrange
            var target = new DispatchEventsHandler(null!, null!);

            // act + assert
            await Assert
                .ThrowsAsync<ArgumentNullException>(() => target.Handle(null!, CancellationToken.None))
                .ConfigureAwait(false);
        }

        [Fact]
        public async Task Handle_EventDispatcherForEventDoesNotExist_Throws()
        {
            // arrange
            var events = new[]
            {
                new DomainEvent(Guid.NewGuid(), "type", new Mock<IIntegrationEvent>().Object)
            };

            var repositoryMock = new Mock<IDomainEventRepository>();
            repositoryMock.Setup(x => x.GetOldestUnsentDomainEventsAsync(It.IsAny<int>())).ReturnsAsync(events);

            var target = new DispatchEventsHandler(repositoryMock.Object, new IIntegrationEventDispatcher[] { new MockedEventDispatcher(handlesEvent: false) });

            // act + assert
            var actual = await Assert
                .ThrowsAsync<InvalidOperationException>(() => target.Handle(new DispatchEventsCommand(), CancellationToken.None))
                .ConfigureAwait(false);

            Assert.Contains(events.First().IntegrationEvent.GetType().Name, actual.Message, StringComparison.CurrentCulture);
        }

        [Fact]
        public async Task Handle_EventDispatcherForEventExists_DoesNotThrow()
        {
            // arrange
            var events = new[]
            {
                new DomainEvent(Guid.NewGuid(), "type", new Mock<IIntegrationEvent>().Object)
            };

            var repositoryMock = new Mock<IDomainEventRepository>();
            repositoryMock.Setup(x => x.GetOldestUnsentDomainEventsAsync(It.IsAny<int>())).ReturnsAsync(events);

            var target = new DispatchEventsHandler(repositoryMock.Object, new IIntegrationEventDispatcher[] { new MockedEventDispatcher(handlesEvent: true) });

            // act + assert
            await target.Handle(new DispatchEventsCommand(), CancellationToken.None).ConfigureAwait(false);
        }

        private sealed class MockedEventDispatcher : IIntegrationEventDispatcher
        {
            private readonly bool _handlesEvent;

            public MockedEventDispatcher(bool handlesEvent)
            {
                _handlesEvent = handlesEvent;
            }

            public Task<bool> TryDispatchAsync(IIntegrationEvent integrationEvent)
            {
                return Task.FromResult(_handlesEvent);
            }
        }
    }
}
