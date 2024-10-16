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

    public async Task<IEnumerable<NotificationDto>> GetNotificationsAsync(CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "api/notifications");

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        var responseContent = await response.Content.ReadFromJsonAsync<IEnumerable<NotificationDto>>(cancellationToken) ?? [];

        response.EnsureSuccessStatusCode();

        return responseContent.Select(notificationDto =>
            new NotificationDto(
                notificationDto.Id,
                notificationDto.NotificationType,
                notificationDto.OccurredAt,
                notificationDto.ExpiresAt,
                notificationDto.RelatedToId ?? string.Empty));
    }

    public async Task<IEnumerable<NotificationDto>> GetUnreadNotificationsAsync(CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "api/notifications/unread");

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        var responseContent = await response.Content.ReadFromJsonAsync<IEnumerable<NotificationDto>>(cancellationToken) ?? [];

        response.EnsureSuccessStatusCode();

        return responseContent.Select(notificationDto =>
            new NotificationDto(
                notificationDto.Id,
                notificationDto.NotificationType,
                notificationDto.OccurredAt,
                notificationDto.ExpiresAt,
                notificationDto.RelatedToId ?? string.Empty));
    }

    public async Task DismissNotificationAsync(int notificationId, CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, $"api/notifications/{notificationId}/dismiss");

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();
    }
}
