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

module "vnet_integrations_webapi" {
  source                                          = "git::https://github.com/Energinet-DataHub/geh-terraform-modules.git//azure/subnet?ref=6.0.0"
  name                                            = "vnet-integrations-webapi"
  project_name                                    = var.domain_name_short
  environment_short                               = var.environment_short
  environment_instance                            = var.environment_instance
  resource_group_name                             = data.azurerm_key_vault_secret.vnet_internal_resource_group_name.value
  virtual_network_name                            = data.azurerm_key_vault_secret.vnet_internal_name.value
  address_prefixes = [
    var.subnet_vnet_integrations_webapi_address_space
  ]
  enforce_private_link_service_network_policies   = true

  # Delegate the subnet to "Microsoft.Web/serverFarms"
  delegations =  [{
    name = "delegation"
    service_delegation_name    = "Microsoft.Web/serverFarms"
    service_delegation_actions = [
      "Microsoft.Network/virtualNetworks/subnets/action"
    ]
  }]
}