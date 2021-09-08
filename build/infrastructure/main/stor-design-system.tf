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
resource "azurerm_storage_account" "stor_design_system" {
  name                      = "stordesign${var.organisation}${var.environment}"
  resource_group_name       = data.azurerm_resource_group.main.name
  location                  = data.azurerm_resource_group.main.location
  account_kind              = "StorageV2"
  account_tier              = "Standard"
  account_replication_type  = "LRS"
  enable_https_traffic_only = true
  tags                      = data.azurerm_resource_group.main.tags
  min_tls_version           = "TLS1_2"

  static_website {
    index_document = "index.html"
  }
}

resource "azurerm_storage_container" "storc_test" {
  name                  = "content"
  storage_account_name  = azurerm_storage_account.stor_design_system.name
  container_access_type = "private"
}

resource "azurerm_storage_blob" "storb_test" {
  name                   = "nice.txt"
  storage_account_name   = azurerm_storage_account.stor_design_system.name
  storage_container_name = azurerm_storage_container.storc_test.name
  type                   = "Block"
  source_content         = azurerm_storage_account.stor_design_system.primary_web_host
}