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

using Energinet.DataHub.WebApi.GraphQL.Subscription;

namespace Energinet.DataHub.WebApi.Clients.Notifications;

/// <summary>
/// Interface for to a client for working with the notification system.
/// </summary>
public interface INotificationsClient
{
    /// <summary>
    /// Get all unread notifications for the current user.
    /// </summary>
    public Task<IEnumerable<Notification>> GetUnreadNotificationsAsync(CancellationToken cancellationToken);

    /// <summary>
    /// Dismisses a notification.
    /// </summary>
    public Task DismissNotificationAsync(int notificationId, CancellationToken cancellationToken);
}
