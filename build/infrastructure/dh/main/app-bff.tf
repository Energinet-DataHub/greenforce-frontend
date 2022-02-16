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
module "app_bff" {
  source                                    = "git::https://github.com/Energinet-DataHub/geh-terraform-modules.git//azure/app-service?ref=6.0.0"

  name                                      = "bff"
  project_name                              = var.domain_name_short
  environment_short                         = var.environment_short
  environment_instance                      = var.environment_instance
  resource_group_name                       = azurerm_resource_group.this.name
  location                                  = azurerm_resource_group.this.location
  vnet_integration_subnet_id                = module.vnet_integrations_webapi.id
  app_service_plan_id                       = module.plan_bff.id
  application_insights_instrumentation_key  = data.azurerm_key_vault_secret.appi_instrumentation_key.value

  app_settings = {
    ApiClientSettings__MeteringPointBaseUrl = data.azurerm_key_vault_secret.app_metering_point_webapi_base_url.value
    ApiClientSettings__ChargesBaseUrl       = data.azurerm_key_vault_secret.app_charges_webapi_base_url.value
    FRONTEND_OPEN_ID_URL                    = data.azurerm_key_vault_secret.frontend_open_id_url.value
    FRONTEND_SERVICE_APP_ID                 = data.azurerm_key_vault_secret.frontend_service_app_id.value
  }

  tags                                      = azurerm_resource_group.this.tags
}

module "plan_bff" {
  source                = "git::https://github.com/Energinet-DataHub/geh-terraform-modules.git//azure/app-service-plan?ref=5.1.0"

  name                  = "bff"
  project_name          = var.domain_name_short
  environment_short     = var.environment_short
  environment_instance  = var.environment_instance
  location              = azurerm_resource_group.this.location
  resource_group_name   = azurerm_resource_group.this.name
  kind                  = "Linux"
  reserved              = true
  sku                   = {
    tier  = "Basic"
    size  = "B1"
  }

  tags                = azurerm_resource_group.this.tags
}

module "kvs_app_bff_base_url" {
  source        = "git::https://github.com/Energinet-DataHub/geh-terraform-modules.git//azure/key-vault-secret?ref=5.1.0"

  name          = "app-bff-base-url"
  value         = "https://${module.app_bff.default_site_hostname}"
  key_vault_id  = data.azurerm_key_vault.kv_shared_resources.id

  tags          = azurerm_resource_group.this.tags
}
