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
resource "azurerm_cdn_profile" "cdn_profile_design_system" {
  name                = "cdn-designsystem-${var.project}-${var.organisation}-${var.environment}"
  location            = data.azurerm_resource_group.main.location
  resource_group_name = data.azurerm_resource_group.main.name
  sku                 = "Standard_Microsoft"
}

resource "azurerm_cdn_endpoint" "cdn_endpoint" {
  name                = "cdn-designsystem-endpoint-${var.project}-${var.organisation}-${var.environment}"
  profile_name        = azurerm_cdn_profile.cdn_profile_design_system.name
  location            = data.azurerm_resource_group.main.location
  resource_group_name = data.azurerm_resource_group.main.name
  origin_host_header  = azurerm_storage_account.stor_design_system.primary_web_host

  origin {
    name                = "cdn-endpoint-${var.project}-${var.organisation}-${var.environment}"
    host_name           = azurerm_storage_account.stor_design_system.primary_web_host
  }
}