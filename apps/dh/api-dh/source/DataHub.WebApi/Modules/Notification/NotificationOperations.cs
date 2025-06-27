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

using System.Reactive.Concurrency;
using System.Reactive.Linq;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Clients.Notifications;
using Energinet.DataHub.WebApi.Clients.Notifications.Dto;
using Energinet.DataHub.WebApi.Modules.Notification.Models;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.Organization;

[ObjectType<NotificationDto>]
public static partial class NotificationOperations
{
    [Query]
    public static async Task<IEnumerable<NotificationDto>> GetNotificationsAsync(
        [Service] INotificationsClient client,
        CancellationToken cancellationToken)
    {
        var noticications = await client.GetUnreadNotificationsAsync(cancellationToken);

        return noticications.Where(n => Enum.TryParse<NotificationType>(n.NotificationType, out _));
    }

    [Mutation]
    [Error(typeof(ApiException))]
    public static async Task<bool> DismissNotificationAsync(
           int notificationId,
           [Service] INotificationsClient client,
           CancellationToken cancellationToken)
    {
        await client.DismissNotificationAsync(notificationId, cancellationToken).ConfigureAwait(false);
        return true;
    }

    [Subscription]
    [Subscribe(With = nameof(OnNotificationAddedAsync))]
    public static NotificationDto NotificationAdded([EventMessage] NotificationDto notification) =>
        notification;

    private static IObservable<NotificationDto> OnNotificationAddedAsync(
       [Service] INotificationsClient notificationsClient,
       CancellationToken cancellationToken)
    {
        return Observable
             .Timer(TimeSpan.Zero, TimeSpan.FromSeconds(60), Scheduler.Default)
             .SelectMany(_ => Observable.FromAsync(() => notificationsClient.GetUnreadNotificationsAsync(cancellationToken)))
             .SelectMany(notification => notification)
             .Where(notification => Enum.TryParse<NotificationType>(notification.NotificationType, out _))
             .Distinct(notification => notification.Id);
    }

    static partial void Configure(
        IObjectTypeDescriptor<NotificationDto> descriptor)
    {
        descriptor
            .Field(x => x.NotificationType)
            .Resolve(context =>
                Enum.Parse<NotificationType>(context.Parent<NotificationDto>().NotificationType));
    }
}
