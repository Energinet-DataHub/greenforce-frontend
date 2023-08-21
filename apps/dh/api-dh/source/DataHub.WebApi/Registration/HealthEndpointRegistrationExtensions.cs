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
using Energinet.DataHub.Core.App.Common.Diagnostics.HealthChecks;
using Microsoft.Extensions.DependencyInjection;

namespace Energinet.DataHub.WebApi.Registration
{
    public static class HealthEndpointRegistrationExtensions
    {
        public static IServiceCollection SetupHealthEndpoints(this IServiceCollection services, ApiClientSettings apiClientSettingsService)
        {
            const string liveEndpointPath = "/monitor/live";
            var marketParticipantLiveHealthUrl = apiClientSettingsService.MarketParticipantBaseUrl == string.Empty
                ? throw new ArgumentException()
                : new Uri(apiClientSettingsService.MarketParticipantBaseUrl + liveEndpointPath);
            var wholesaleLiveHealthUrl = apiClientSettingsService.WholesaleBaseUrl == string.Empty
                ? throw new ArgumentException()
                : new Uri(apiClientSettingsService.WholesaleBaseUrl + liveEndpointPath);

            services.AddHealthChecks()
                .AddLiveCheck()
                .AddServiceHealthCheck("marketParticipant", marketParticipantLiveHealthUrl)
                .AddServiceHealthCheck("wholesale", wholesaleLiveHealthUrl);

            return services;
        }
    }
}
