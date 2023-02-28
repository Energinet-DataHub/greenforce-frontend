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
using System.IO;
using System.Reflection;
using System.Text.Json.Serialization;
using Energinet.DataHub.Core.App.WebApp.Authentication;
using Energinet.DataHub.Core.App.WebApp.Diagnostics.HealthChecks;
using Energinet.DataHub.WebApi.GraphQL;
using Energinet.DataHub.WebApi.Registration;
using GraphQL;
using GraphQL.DataLoader;
using GraphQL.MicrosoftDI;
using GraphQL.Server.Ui.Playground;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

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
            services.AddApplicationInsightsTelemetry();

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
            var backendAppId = Configuration.GetValue<string>("BACKEND_SERVICE_APP_ID") ?? string.Empty;
            services.AddJwtBearerAuthentication(externalOpenIdUrl, internalOpenIdUrl, backendAppId);

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
            services.AddGraphQLSchema();
            services.AddGraphQL(options =>
                    options.ConfigureExecution((opt, next) =>
                    {
                        var listener = opt.RequestServices!.GetRequiredService<DataLoaderDocumentListener>();
                        opt.Listeners.Add(listener);
                        opt.EnableMetrics = true;
                        return next(opt);
                    })
                    .AddSystemTextJson()
                    .AddSchema<GraphQLSchema>()
                    .AddErrorInfoProvider(opts =>
                        opts.ExposeExceptionDetails = true));

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
                var builder = endpoints.MapControllers();

                if (!Environment.IsDevelopment())
                {
                    builder.RequireAuthorization();
                }

                // Health check
                endpoints.MapLiveHealthChecks();
                endpoints.MapReadyHealthChecks();
            });

            app.UseGraphQL("/graphql");            // url to host GraphQL endpoint
            app.UseGraphQLPlayground(
                "/",                               // url to host Playground at
                new PlaygroundOptions
                {
                    GraphQLEndPoint = "/graphql",         // url of GraphQL endpoint
                    SubscriptionsEndPoint = "/graphql",   // url of GraphQL endpoint
                });
        }

        protected virtual void SetupHealthEndpoints(IServiceCollection services, ApiClientSettings apiClientSettingsService)
        {
            services.SetupHealthEndpoints(apiClientSettingsService);
        }
    }
}
