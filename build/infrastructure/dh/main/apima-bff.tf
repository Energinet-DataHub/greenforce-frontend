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
module "apima_bff" {
  source                      = "git::https://github.com/Energinet-DataHub/geh-terraform-modules.git//azure/api-management-api?ref=5.15.0"

  name                        = "bff"
  project_name                = var.domain_name_short
  environment_short           = var.environment_short
  environment_instance        = var.environment_instance
  api_management_name         = data.azurerm_key_vault_secret.apim_instance_name.value
  resource_group_name         = data.azurerm_key_vault_secret.apim_instance_resource_group_name.value
  display_name                = "BFF Api"
  apim_logger_id              = data.azurerm_key_vault_secret.apim_logger_id.value
  logger_sampling_percentage  = 100.0
  path                        = "bff"
  backend_service_url         = azurerm_app_service.bff.default_site_hostname
  api_content_import          = {
    content_content_format  = "swagger-json"
    content_value           = data.local_file.swagger_file
  }
}

data "local_file" "swagger_file" {
    filename = "${path.module}/../../swagger/swagger.json"
}