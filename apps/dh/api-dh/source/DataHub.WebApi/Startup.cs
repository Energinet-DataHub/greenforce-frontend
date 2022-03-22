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
using Energinet.DataHub.Charges.Clients.Registration.ChargeLinks.ServiceCollectionExtensions;
using Energinet.DataHub.Core.App.WebApp.Middleware;
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MessageArchive.Client.Extensions;
using Energinet.DataHub.MeteringPoints.Client.Extensions;
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
            services.AddControllers()
                .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

            services.AddHealthChecks();

            AddDomainClients(services);

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

            var openIdUrl = Configuration.GetValue<string>("FRONTEND_OPEN_ID_URL") ?? string.Empty;

            var audience = Configuration.GetValue<string>("FRONTEND_SERVICE_APP_ID") ?? string.Empty;

            services.AddJwtTokenSecurity(openIdUrl, audience);

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
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </summary>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment environment)
        {
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

            app.UseMiddleware<JwtTokenMiddleware>();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHealthChecks("/health").AllowAnonymous();
            });
        }

        private void AddDomainClients(IServiceCollection services)
        {
            var apiClientSettings = Configuration.GetSection("ApiClientSettings").Get<ApiClientSettings>();

            AddMeteringPointClient(services, apiClientSettings);
            AddChargeLinksClient(services, apiClientSettings);
            AddMessageArchiveClient(services, apiClientSettings);
            AddMarketParticipantClient(services, apiClientSettings);
        }

        private static void AddChargeLinksClient(IServiceCollection services, ApiClientSettings apiClientSettings)
        {
            string emptyUrl = "https://empty";
            Uri chargesBaseUrl = Uri.TryCreate(apiClientSettings?.ChargesBaseUrl, UriKind.Absolute, out var url)
                ? url
                : new Uri(emptyUrl);

            services.AddChargeLinksClient(chargesBaseUrl);
        }

        private static void AddMeteringPointClient(IServiceCollection services, ApiClientSettings? apiClientSettings)
        {
            string emptyUrl = "https://empty";
            Uri meteringPointBaseUrl = Uri.TryCreate(apiClientSettings?.MeteringPointBaseUrl, UriKind.Absolute, out var url)
                ? url
                : new Uri(emptyUrl);

            services.AddMeteringPointClient(meteringPointBaseUrl);
        }

        private static void AddMessageArchiveClient(IServiceCollection services, ApiClientSettings? apiClientSettings)
        {
            string emptyUrl = "https://empty";
            Uri messageArchiveBaseUrl = Uri.TryCreate(apiClientSettings?.MessageArchiveBaseUrl, UriKind.Absolute, out var url)
                ? url
                : new Uri(emptyUrl);

            services.AddMessageArchiveClient(messageArchiveBaseUrl);
        }

        private static void AddMarketParticipantClient(IServiceCollection services, ApiClientSettings? apiClientSettings)
        {
            string emptyUrl = "https://empty";
            Uri messageArchiveBaseUrl = Uri.TryCreate(apiClientSettings?.MarketParticipantBaseUrl, UriKind.Absolute, out var url)
                ? url
                : new Uri(emptyUrl);

            services.AddMarketParticipantClient(messageArchiveBaseUrl);
        }
    }
}
