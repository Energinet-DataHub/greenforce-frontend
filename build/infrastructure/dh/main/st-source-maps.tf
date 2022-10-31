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
module "st_source_maps" {
  source                      = "git::https://github.com/Energinet-DataHub/geh-terraform-modules.git//azure/storage-account?ref=7.2.0"

  name                        = "sourcemaps"
  project_name                = var.domain_name_short
  environment_short           = var.environment_short
  environment_instance        = var.environment_instance
  resource_group_name         = azurerm_resource_group.this.name
  location                    = azurerm_resource_group.this.location
  account_replication_type    = "LRS"
  access_tier                 = "Hot"
  account_tier                = "Standard"
  log_analytics_workspace_id  = data.azurerm_key_vault_secret.log_shared_id.value
  private_endpoint_subnet_id  = data.azurerm_key_vault_secret.snet_private_endpoints_id.value
  
  containers                  = [
    {
      name = "sourcemaps"
    },
  ]

  tags                        = azurerm_resource_group.this.tags
}

resource "azurerm_role_assignment" "this" {
  scope                 = module.st_source_maps.id
  role_definition_name  = "Storage Blob Data Reader"
  principal_id          = var.azure_ad_security_group_id
}

module "kvs_st_source_maps_primary_connection_string" {
  source        = "git::https://github.com/Energinet-DataHub/geh-terraform-modules.git//azure/key-vault-secret?ref=7.2.0"
  
  name          = "st-sourcemaps-primary-connection-string"
  value         = module.st_source_maps.primary_connection_string
  key_vault_id  = data.azurerm_key_vault.kv_shared_resources.id

  tags          = azurerm_resource_group.this.tags
}

module "kvs_st_source_maps_name" {
  source        = "git::https://github.com/Energinet-DataHub/geh-terraform-modules.git//azure/key-vault-secret?ref=7.2.0"
  
  name          = "st-sourcemaps-name"
  value         = module.st_source_maps.name
  key_vault_id  = data.azurerm_key_vault.kv_shared_resources.id

  tags          = azurerm_resource_group.this.tags
}
