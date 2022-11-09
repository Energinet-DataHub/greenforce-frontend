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

namespace Energinet.DataHub.MarketParticipant.Common.Configuration;

public static class Settings
{
    public static Setting<string> SqlDbConnectionString { get; }
        = new("SQL_MP_DB_CONNECTION_STRING");

    public static Setting<string> ServiceBusTopicConnectionString { get; }
        = new("SERVICE_BUS_CONNECTION_STRING");
    public static Setting<string> ServiceBusTopicName { get; }
        = new("SBT_MARKET_PARTICIPANT_CHANGED_NAME");

    public static Setting<string> B2CBackendObjectId { get; }
        = new("AZURE_B2C_BACKEND_OBJECT_ID");
    public static Setting<string> B2CBackendServicePrincipalNameObjectId { get; }
        = new("AZURE_B2C_BACKEND_SPN_OBJECT_ID");
    public static Setting<string> B2CBackendId { get; }
        = new("AZURE_B2C_BACKEND_ID");
    public static Setting<string> B2CTenant { get; }
        = new("AZURE_B2C_TENANT");
    public static Setting<string> B2CServicePrincipalNameId { get; }
        = new("AZURE_B2C_SPN_ID");
    public static Setting<string> B2CServicePrincipalNameSecret { get; }
        = new("AZURE_B2C_SPN_SECRET");

    public static Setting<string> FrontendOpenIdUrl { get; }
        = new("FRONTEND_OPEN_ID_URL");
    public static Setting<string> FrontendAppId { get; }
        = new("FRONTEND_SERVICE_APP_ID");

    public static Setting<string> ServiceBusHealthCheckConnectionString { get; }
        = new("SERVICE_BUS_HEALTH_CHECK_CONNECTION_STRING");

    public static Setting<bool> RolesValidationEnabled { get; }
        = new("ROLES_VALIDATION_ENABLED");
}
