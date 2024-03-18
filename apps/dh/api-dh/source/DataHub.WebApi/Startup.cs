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

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json.Serialization;
using Azure.Monitor.OpenTelemetry.AspNetCore;
using Energinet.DataHub.Core.App.WebApp.Authentication;
using Energinet.DataHub.Core.App.WebApp.Diagnostics.HealthChecks;
using Energinet.DataHub.WebApi.Registration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using OpenTelemetry.Trace;

namespace Energinet.DataHub.WebApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
        }

        private IConfiguration Configuration { get; }

        private IWebHostEnvironment Environment { get; }

        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// </summary>
        public void ConfigureServices(IServiceCollection services)
        {
            if (!System.Environment.GetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING").IsNullOrEmpty())
            {
                services
                    .ConfigureOpenTelemetryTracerProvider((provider, builder) => builder.AddHotChocolateInstrumentation())
                    .AddOpenTelemetry()
                    .UseAzureMonitor();
            }

            services.AddControllers()
                .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

            services.AddHealthChecks();

            services.AddHttpContextAccessor();

            // Register the Swagger generator, defining 1 or more Swagger documents.
            services.AddSwaggerGen(config =>
            {
                config.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "DataHub BFF",
                    Version = "1.0.0",
                    Description = "Backend-for-frontend for DataHub",
                });

                config.SchemaFilter<RequireNonNullablePropertiesSchemaFilter>();
                config.SupportNonNullableReferenceTypes();
                config.CustomSchemaIds(x => GetCustomSchemaIds(x.FullName));

                // Set the comments path for the Swagger JSON and UI.
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                config.IncludeXmlComments(xmlPath);

                var securitySchema = new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer", },
                };

                config.AddSecurityDefinition("Bearer", securitySchema);

                var securityRequirement = new OpenApiSecurityRequirement { { securitySchema, new[] { "Bearer" } }, };

                config.AddSecurityRequirement(securityRequirement);
            });

            var externalOpenIdUrl = Configuration.GetValue<string>("EXTERNAL_OPEN_ID_URL") ?? string.Empty;
            var internalOpenIdUrl = Configuration.GetValue<string>("INTERNAL_OPEN_ID_URL") ?? string.Empty;
            var backendBffAppId = Configuration.GetValue<string>("BACKEND_BFF_APP_ID") ?? string.Empty;
            services.AddJwtBearerAuthentication(externalOpenIdUrl, internalOpenIdUrl, backendBffAppId);

            services.AddAuthorization(options =>
            {
                options.AddPolicy("fas", policy => policy.RequireClaim("membership", "fas"));
            });

            if (Environment.IsDevelopment())
            {
                services.AddCors(options =>
                {
                    options.AddDefaultPolicy(builder => builder
                        .AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod());
                });
            }

            var apiClientSettings = Configuration.GetSection("ApiClientSettings").Get<ApiClientSettings>()
                                    ?? new ApiClientSettings();
            services.AddDomainClients(apiClientSettings);

            services
                .AddGraphQLServices()
                .ModifyRequestOptions(options =>
                {
                    options.IncludeExceptionDetails = Environment.IsDevelopment();
                });

            SetupHealthEndpoints(services, apiClientSettings);
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </summary>
        public void Configure(IApplicationBuilder app)
        {
            if (Environment.IsDevelopment())
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

            app.UseEndpoints(endpoints =>
            {
                var controllerBuilder = endpoints.MapControllers();
                var graphQLBuilder = endpoints.MapGraphQL(path: "/graphql");

                if (!Environment.IsDevelopment())
                {
                    controllerBuilder.RequireAuthorization();
                    graphQLBuilder.RequireAuthorization();
                }

                // Health check
                endpoints.MapLiveHealthChecks();
                endpoints.MapReadyHealthChecks();
            });
        }

        protected virtual void SetupHealthEndpoints(IServiceCollection services, ApiClientSettings apiClientSettingsService)
        {
            services.SetupHealthEndpoints(apiClientSettingsService);
        }

        // TODO: Make this better when all clients are generated by nswag
        private static string GetCustomSchemaIds(string? fullName)
        {
            var domainList = new Dictionary<string, string>
            {
                { "Wholesale", "Wholesale" },
                { "MeteringPoints", "MeteringPoint" },
                { "MarketParticipant", "MarketParticipant" },
                { "Charges", "Charge" },
            };

            if (fullName == null)
            {
                return string.Empty;
            }

            var fullNameSplit = fullName.Split(".");
            var domain = string.Empty;
            foreach (var item in domainList.Where(item => fullNameSplit.Contains(item.Key)))
            {
                domain = item.Value;
            }

            if (fullNameSplit.Last().Contains(domain))
            {
                domain = string.Empty;
            }

            var customSchema = $"{domain}{fullNameSplit.Last()}";
            return customSchema;
        }
    }
}
