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
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.EDI.B2CClient;
using Energinet.DataHub.EDI.B2CClient.Abstractions.ActorMessageQueues.V1.Models;
using Energinet.DataHub.EDI.B2CClient.Abstractions.Framework;
using Energinet.DataHub.WebApi.Modules.ActorMessageQueue;
using FluentAssertions;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Modules.ActorMessageQueue;

public class ActorMessageQueueOperationsTests
{
    [Fact]
    public async Task GetActorMessageQueuesAsync_FiltersOutMessagesWithUndefinedEnumValues()
    {
        var enqueuedAt = new DateTimeOffset(2025, 12, 31, 23, 0, 0, TimeSpan.Zero);
        var validMessage = new MessageV1(
            "valid-message",
            OutgoingDocumentTypeV1.Acknowledgement,
            BusinessReasonV1.CustomerMoveIn,
            enqueuedAt);
        var unknownDocumentTypeMessage = new MessageV1(
            "unknown-document-type",
            (OutgoingDocumentTypeV1)999,
            BusinessReasonV1.CustomerMoveIn,
            enqueuedAt);
        var unknownBusinessReasonMessage = new MessageV1(
            "unknown-business-reason",
            OutgoingDocumentTypeV1.Acknowledgement,
            (BusinessReasonV1)999,
            enqueuedAt);

        var response = new ActorMessageQueuesResponseV1(
            new Dictionary<MessageCategoryV1, ActorQueueV1>
            {
                [MessageCategoryV1.Processes] = new ActorQueueV1(
                    MessageCategoryV1.Processes,
                    NumberOfMessagesInQueue: 3,
                    Messages: new[] { validMessage, unknownDocumentTypeMessage, unknownBusinessReasonMessage }),
            });

        var ediB2CClient = new Mock<IB2CClient>();
        ediB2CClient
            .Setup(x => x.SendAsync(
                It.IsAny<Command<ActorMessageQueuesResponseV1>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<ActorMessageQueuesResponseV1>.Success(response));

        var result = await ActorMessageQueueOperations.GetActorMessageQueuesAsync(
            "5790000000000",
            "EnergySupplier",
            ediB2CClient.Object,
            CancellationToken.None);

        var queue = result.Queues.Should().ContainSingle().Subject;
        queue.Count.Should().Be(3);
        queue.Messages.Should().ContainSingle()
            .Which.MessageId.Should().Be("valid-message");
    }
}
