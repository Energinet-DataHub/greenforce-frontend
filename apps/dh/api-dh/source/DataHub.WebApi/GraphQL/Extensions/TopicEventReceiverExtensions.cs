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

using System.Reactive.Linq;
using HotChocolate.Subscriptions;

namespace Energinet.DataHub.WebApi.GraphQL;

public static class TopicEventReceiverExtensions
{
    internal static IObservable<T> Observe<T>(
        this ITopicEventReceiver eventReceiver,
        string topicName,
        CancellationToken cancellationToken) =>
        Observable.Create<T>(async observer =>
        {
            try
            {
                var sourceStream = await eventReceiver
                    .SubscribeAsync<T>(topicName, cancellationToken);

                await foreach (var item in sourceStream.ReadEventsAsync())
                {
                    if (cancellationToken.IsCancellationRequested)
                    {
                        break;
                    }

                    observer.OnNext(item);
                }

                observer.OnCompleted();
            }
            catch (Exception ex)
            {
                observer.OnError(ex);
            }
        });
}
