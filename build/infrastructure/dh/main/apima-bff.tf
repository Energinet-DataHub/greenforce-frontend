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
  source                      = "git::https://github.com/Energinet-DataHub/geh-terraform-modules.git//azure/api-management-api?ref=7.2.0"

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
  logger_verbosity            = "verbose"
  path                        = "bff"
  backend_service_url         = "https://${module.bff.default_hostname}"
  import                      =  {
    content_format          = "openapi+json"
    content_value           = data.local_file.swagger_file.content
  }
  policies                    = [
    {
      xml_content = <<XML
        <policies>
          <inbound>
            <trace source="BFF API" severity="verbose">
                <message>@{
                    string authHeader = context.Request.Headers.GetValueOrDefault("Authorization", "");
                    string callerId = "(empty)";
                    if (authHeader?.Length > 0)
                    {
                        string[] authHeaderParts = authHeader.Split(' ');
                        if (authHeaderParts?.Length == 2 && authHeaderParts[0].Equals("Bearer", StringComparison.InvariantCultureIgnoreCase))
                        {
                            Jwt jwt;
                            if (authHeaderParts[1].TryParseJwt(out jwt))
                            {
                                callerId = (jwt.Claims.GetValueOrDefault("sub", "(empty)"));
                            }
                        }
                    }
                    return $"Caller ID (claims.sub): {callerId}";
                }</message>
                <metadata name="CorrelationId" value="@($"{context.RequestId}")" />
            </trace>
            <validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Failed policy requirements, or token is invalid or missing.">
                <openid-config url="${data.azurerm_key_vault_secret.frontend_open_id_url.value}" />
                <required-claims>
                    <claim name="aud" match="any">
                        <value>${data.azurerm_key_vault_secret.frontend_service_app_id.value}</value>
                    </claim>
                </required-claims>
            </validate-jwt>
            <base />
            <set-header name="CorrelationId" exists-action="override">
                <value>@($"{context.RequestId}")</value>
            </set-header>
            <set-header name="RequestTime" exists-action="override">
                <value>@(DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"))</value>
            </set-header>
            <cors allow-credentials="true">
                <allowed-origins>
                    <origin>https://${azurerm_static_site.ui.default_host_name}</origin>
                </allowed-origins>
                <allowed-methods preflight-result-max-age="300">
                    <method>*</method>
                </allowed-methods>
                <allowed-headers>
                    <header>*</header>
                </allowed-headers>
                <expose-headers>
                    <header>*</header>
                </expose-headers>
            </cors>
          </inbound>
          <backend>
              <base />
          </backend>
          <outbound>
              <base />
              <set-header name="CorrelationId" exists-action="override">
                  <value>@($"{context.RequestId}")</value>
              </set-header>
          </outbound>
          <on-error>
              <base />
              <set-header name="CorrelationId" exists-action="override">
                  <value>@($"{context.RequestId}")</value>
              </set-header>
          </on-error>
        </policies>
      XML
    }
  ]
}

data "local_file" "swagger_file" {
    filename = "${path.module}/../../swagger.json"
}

resource "azurerm_api_management_authorization_server" "oauth_server_bff" {
  name                         = "bffoauthserver"
  api_management_name          = data.azurerm_key_vault_secret.apim_instance_name.value
  resource_group_name          = data.azurerm_key_vault_secret.apim_instance_resource_group_name.value
  display_name                 = "BFF: OAuth client credentials server"
  client_registration_endpoint = "http://localhost/"
  grant_types = [
    "implicit",
  ]
  authorization_endpoint       = "${var.apim_b2c_tenant_frontend_userflow}/oauth2/v2.0/authorize"
  authorization_methods        =  [
    "GET",
  ]
  token_endpoint               = "${var.apim_b2c_tenant_frontend_userflow}/oauth2/v2.0/token"
  client_authentication_method = [
    "Body",
  ]
  bearer_token_sending_methods = [
    "authorizationHeader",
  ]
  client_id                    = data.azurerm_key_vault_secret.frontend_service_app_id.value
}

module "kvs_app_bff_base_url" {
  source        = "git::https://github.com/Energinet-DataHub/geh-terraform-modules.git//azure/key-vault-secret?ref=5.1.0"

  name          = "app-bff-base-url"
  value         = "${data.azurerm_key_vault_secret.apim_gateway_url.value}/${module.apima_bff.path}"
  key_vault_id  = data.azurerm_key_vault.kv_shared_resources.id

  tags          = azurerm_resource_group.this.tags
}
