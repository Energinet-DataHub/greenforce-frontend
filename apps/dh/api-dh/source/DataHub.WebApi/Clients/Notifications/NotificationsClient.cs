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

using Energinet.DataHub.WebApi.Clients.Notifications.Dto;
using Energinet.DataHub.WebApi.GraphQL.Subscription;

namespace Energinet.DataHub.WebApi.Clients.Notifications;

public sealed class NotificationClient : INotificationsClient
{
    private readonly HttpClient _httpClient;

    public NotificationClient(string baseUrl, HttpClient httpClient)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(baseUrl);
        ArgumentNullException.ThrowIfNull(httpClient);

        _httpClient = httpClient;
    }

    public async Task<IEnumerable<Notification>> GetNotificationsAsync(CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "notifications");

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        var responseContent = await response.Content.ReadFromJsonAsync<IEnumerable<NotificationDto>>(cancellationToken) ?? [];

        response.EnsureSuccessStatusCode();

        return responseContent.Select(notificationDto =>
            new Notification(
                notificationDto.NotificationType,
                notificationDto.RelatedToId ?? string.Empty,
                notificationDto.OccurredAt,
                notificationDto.ExpiresAt));
    }

    public async Task<IEnumerable<Notification>> GetUnreadNotificationsAsync(CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "notifications/unread");

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        var responseContent = await response.Content.ReadFromJsonAsync<IEnumerable<NotificationDto>>(cancellationToken) ?? [];

        response.EnsureSuccessStatusCode();

        return responseContent.Select(notificationDto =>
            new Notification(
                notificationDto.NotificationType,
                notificationDto.RelatedToId ?? string.Empty,
                notificationDto.OccurredAt,
                notificationDto.ExpiresAt));
    }

    public async Task DismissNotificationAsync(int notificationId, CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, $"notifications/{notificationId}/dismiss");

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();
    }
}
