# Copyright 2020 Energinet DataHub A/S
#
# Licensed under the Apache License, Version 2.0 (the "License2");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
module "bff" {
  source                                    = "git::https://github.com/Energinet-DataHub/geh-terraform-modules.git//azure/app-service?ref=v9"

  name                                          = "bff"
  project_name                                  = var.domain_name_short
  environment_short                             = var.environment_short
  environment_instance                          = var.environment_instance
  resource_group_name                           = azurerm_resource_group.this.name
  location                                      = azurerm_resource_group.this.location
  vnet_integration_subnet_id                    = data.azurerm_key_vault_secret.snet_vnet_integrations_id.value
  private_endpoint_subnet_id                    = data.azurerm_key_vault_secret.snet_private_endpoints_id.value
  app_service_plan_id                           = data.azurerm_key_vault_secret.plan_shared_id.value
  application_insights_instrumentation_key      = data.azurerm_key_vault_secret.appi_shared_instrumentation_key.value
  health_check_path                             = "/monitor/ready"
  health_check_alert_action_group_id            = data.azurerm_key_vault_secret.primary_action_group_id.value
  health_check_alert_enabled                    = var.enable_health_check_alerts
  dotnet_framework_version                      = "v6.0"

  app_settings = {
    ApiClientSettings__MessageArchiveBaseUrl    = "@Microsoft.KeyVault(VaultName=${var.shared_resources_keyvault_name};SecretName=app-message-archive-api-base-url)",
    ApiClientSettings__MeteringPointBaseUrl     = "@Microsoft.KeyVault(VaultName=${var.shared_resources_keyvault_name};SecretName=app-metering-point-webapi-base-url)",
    ApiClientSettings__ChargesBaseUrl           = "@Microsoft.KeyVault(VaultName=${var.shared_resources_keyvault_name};SecretName=app-charges-webapi-base-url)",
    ApiClientSettings__MarketParticipantBaseUrl = "@Microsoft.KeyVault(VaultName=${var.shared_resources_keyvault_name};SecretName=app-markpart-webapi-base-url)",
    ApiClientSettings__WholesaleBaseUrl         = "@Microsoft.KeyVault(VaultName=${var.shared_resources_keyvault_name};SecretName=app-wholesale-api-base-url)",
    FRONTEND_OPEN_ID_URL                        = "@Microsoft.KeyVault(VaultName=${var.shared_resources_keyvault_name};SecretName=frontend-open-id-url)",
    FRONTEND_SERVICE_APP_ID                     = "@Microsoft.KeyVault(VaultName=${var.shared_resources_keyvault_name};SecretName=frontend-service-app-id)",
  }
 
  tags                                          = azurerm_resource_group.this.tags
}
