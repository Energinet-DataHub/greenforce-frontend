ARG BUILD_ENV=production

FROM mcr.microsoft.com/dotnet/sdk:9.0-noble AS build
WORKDIR /app

COPY apps/dh/api-dh ./apps/dh/api-dh
RUN dotnet restore apps/dh/api-dh/source/DataHub.WebApi/DataHub.WebApi.csproj

COPY apps/dh/api-dh/source/DataHub.WebApi ./apps/dh/api-dh/source/DataHub.WebApi
RUN dotnet publish apps/dh/api-dh/source/DataHub.WebApi/DataHub.WebApi.csproj \
    -c Release \
    -o /out \
    /p:TreatWarningsAsErrors=false \
    /p:SkipSwaggerGen=true \
    /p:SkipSchemaExport=true

FROM mcr.microsoft.com/dotnet/aspnet:9.0-noble-chiseled-extra AS base-production
FROM mcr.microsoft.com/dotnet/aspnet:9.0-noble AS base-development

FROM base-${BUILD_ENV} AS final

WORKDIR /app

ARG BUILD_ENV
RUN if [ "$BUILD_ENV" = "development" ]; then \
    apt-get update && \
    apt-get install -y curl && \
    curl -sL https://aka.ms/InstallAzureCLIDeb | bash && \
    rm -rf /var/lib/apt/lists/* && \
    mkdir -p /home/app/.azure && chown -R app:app /home/app/.azure; \
    fi

COPY --from=build --chown=app:app /out .

ENV ASPNETCORE_HTTP_PORTS=8080

EXPOSE 8080

USER app

ENTRYPOINT ["dotnet", "Energinet.DataHub.WebApi.dll"]
