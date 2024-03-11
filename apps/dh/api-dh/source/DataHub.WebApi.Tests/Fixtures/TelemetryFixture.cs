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
using Azure.Identity;
using Azure.Monitor.Query;
using Energinet.DataHub.Core.FunctionApp.TestCommon.Configuration;

namespace Energinet.DataHub.WebApi.Tests.Fixtures
{
    public class TelemetryFixture
    {
        public IntegrationTestConfiguration IntegrationTestConfiguration { get; } = new();

        public LogsQueryClient LogsQueryClient { get; } = new(new DefaultAzureCredential());

        public string LogAnalyticsWorkspaceId => IntegrationTestConfiguration.LogAnalyticsWorkspaceId;

        public TelemetryFixture()
        {
            Environment.SetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING", IntegrationTestConfiguration.ApplicationInsightsConnectionString);
        }
    }
}
