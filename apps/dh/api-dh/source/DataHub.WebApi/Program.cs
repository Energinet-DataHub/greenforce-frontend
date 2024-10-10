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

using System.Text.Json.Serialization;
using Azure.Monitor.OpenTelemetry.AspNetCore;
using Energinet.DataHub.Core.App.Common.Extensions.Options;
using Energinet.DataHub.Core.App.WebApp.Extensions.Builder;
using Energinet.DataHub.Core.App.WebApp.Extensions.DependencyInjection;
using Energinet.DataHub.WebApi;
using Energinet.DataHub.WebApi.Registration;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.IdentityModel.Tokens;
using OpenTelemetry.Trace;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;
var configuration = builder.Configuration;
var environment = builder.Environment;

if (!Environment.GetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING").IsNullOrEmpty())
{
    services
        .ConfigureOpenTelemetryTracerProvider((_, b) => b.AddHotChocolateInstrumentation())
        .AddOpenTelemetry()
        .UseAzureMonitor();
}

builder.Services.AddApplicationInsightsForWebApp("BFF");

services
    .AddControllers()
    .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost | ForwardedHeaders.XForwardedPrefix;

    // The api is not public so we will allow any proxy
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

services.AddHttpContextAccessor();

services.AddSwagger();

services.AddJwtBearerAuthenticationForWebApp(builder.Configuration);

services
    .AddAuthorizationBuilder()
    .AddPolicy("fas", policy => policy.RequireClaim("multitenancy", "true"));

if (environment.IsDevelopment())
{
    services.AddCors(options =>
    {
        options.AddDefaultPolicy(b => b
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());
    });
}

var apiClientSettings = configuration.GetSection("ApiClientSettings").Get<ApiClientSettings>() ?? new ApiClientSettings();
services.AddDomainClients(apiClientSettings);

services
    .AddGraphQLServices()
    .ModifyRequestOptions(options =>
    {
        options.IncludeExceptionDetails = environment.IsDevelopment();
    });

services.SetupHealthEndpoints(apiClientSettings);

var app = builder.Build();

app.UseForwardedHeaders();

if (environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();

    // Enable middleware to serve generated Swagger as a JSON endpoint.
    app.UseSwagger();

    // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.)
    app.UseSwaggerUI(options =>
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "DataHub.WebApi v1"));
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

var controllerBuilder = app.MapControllers();
// If the endpoint name is changed, remember to change the APIM policy as well (dh3-infrastructure)
var graphQLBuilder = app.MapGraphQL(path: "/graphql");

if (!environment.IsDevelopment())
{
    controllerBuilder.RequireAuthorization();
    graphQLBuilder.RequireAuthorization();
}

app.MapLiveHealthChecks();
app.MapReadyHealthChecks();
app.MapStatusHealthChecks();

app.RunWithGraphQLCommands(args);

// Make the implicit Program class public so test projects can access it
public partial class Program;
