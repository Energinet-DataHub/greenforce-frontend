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
  authorization_server_name   = azurerm_api_management_authorization_server.oauth_server_bff.name
  apim_logger_id              = data.azurerm_key_vault_secret.apim_logger_id.value
  logger_sampling_percentage  = 100.0
  path                        = "bff"
  backend_service_url         = "https://${azurerm_app_service.bff.default_site_hostname}"
  import                      =  {
    content_format          = "openapi+json"
    content_value           = data.local_file.swagger_file.content
  }
  policies                    = [
    {
      xml_content = <<XML
        <policies>
          <inbound>
            <base />
            <validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Failed policy requirements, or token is invalid or missing.">
                <openid-config url="https://login.microsoftonline.com/${var.apim_b2c_tenant_id}/v2.0/.well-known/openid-configuration" />
                <required-claims>
                    <claim name="aud" match="any">
                        <value>${var.frontend_app_id}</value>
                    </claim>
                </required-claims>
            </validate-jwt>
            <set-header name="Correlation-ID" exists-action="override">
                <value>@($"{context.RequestId}")</value>
            </set-header>
            <set-header name="RequestTime" exists-action="override">
                <value>@(DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"))</value>
            </set-header>
          </inbound>
          <backend>
              <base />
          </backend>
          <outbound>
              <base />
          </outbound>
          <on-error>
              <base />
          </on-error>
        </policies>
      XML
    }
  ]
}

data "local_file" "swagger_file" {
    filename = "${path.module}/../../swagger/swagger.json"
}

resource "azurerm_api_management_authorization_server" "oauth_server_bff" {
  name                         = "oauthserver_bff"
  api_management_name          = data.azurerm_key_vault_secret.apim_instance_name.value
  resource_group_name          = data.azurerm_key_vault_secret.apim_instance_resource_group_name.value
  display_name                 = "BFF: OAuth client credentials server"
  client_registration_endpoint = "http://localhost/"
  grant_types = [
    "implicit",
  ]
  authorization_endpoint       = "https://login.microsoftonline.com/${var.apim_b2c_tenant_id}/oauth2/v2.0/authorize"
  authorization_methods        =  [
    "GET",
  ]
  token_endpoint               = "https://login.microsoftonline.com/${var.apim_b2c_tenant_id}/oauth2/v2.0/token"
  client_authentication_method = [
    "Body",
  ]
  bearer_token_sending_methods = [
    "authorizationHeader",
  ]
  client_id                    = var.frontend_app_id
}