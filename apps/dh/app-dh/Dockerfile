FROM mcr.microsoft.com/dotnet/sdk:9.0-noble AS dotnet-build

WORKDIR /app

COPY apps/dh/api-dh ./apps/dh/api-dh
RUN mkdir -p libs/dh/shared/data-access-graphql

RUN dotnet build apps/dh/api-dh/source/DataHub.WebApi/DataHub.WebApi.csproj --configuration=Release

FROM node:24-alpine3.23 AS build

WORKDIR /app

RUN apk add --no-cache openjdk11

# Add a no-op dotnet wrapper since api-dh is already built
RUN echo '#!/bin/sh' > /usr/local/bin/dotnet && echo 'exit 0' >> /usr/local/bin/dotnet && chmod +x /usr/local/bin/dotnet

RUN npm install -g bun@1.3.1

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile --yarn

COPY nx.json tsconfig.base.json .graphqlrc.yml codegen.ts .eslintrc.json ./
COPY apps/dh/app-dh ./apps/dh/app-dh

COPY libs ./libs
COPY --from=dotnet-build /app/libs/dh/shared/data-access-graphql/schema.graphql ./libs/dh/shared/data-access-graphql/schema.graphql
COPY --from=dotnet-build /app/apps/dh/api-dh/source/DataHub.WebApi/project.json ./apps/dh/api-dh/source/DataHub.WebApi/project.json

ARG NX_BRANCH
ARG NX_CI_EXECUTION_ID
RUN --mount=type=secret,id=NX_CLOUD_ACCESS_TOKEN export NX_CLOUD_ACCESS_TOKEN=$(cat /run/secrets/NX_CLOUD_ACCESS_TOKEN) && \
  export NX_DAEMON=false && \
  bun run nx build app-dh --configuration=production

RUN bun run i18n:optimize:app-dh

RUN cp libs/dh/shared/assets/src/assets/configuration/dh-api-environment.docker.json dist/apps/dh/app-dh/browser/assets/configuration/dh-api-environment.json \
  && cp libs/dh/shared/assets/src/assets/configuration/dh-b2c-environment.docker.json dist/apps/dh/app-dh/browser/assets/configuration/dh-b2c-environment.json \
  && cp libs/dh/shared/assets/src/assets/configuration/dh-app-environment.docker.json dist/apps/dh/app-dh/browser/assets/configuration/dh-app-environment.json

RUN apk add --no-cache syft
RUN syft ./yarn.lock -o spdx-json > sbom.spdx.json

FROM nginxinc/nginx-unprivileged:alpine3.23-slim

ENV NGINX_ENVSUBST_TEMPLATE_DIR=/etc/nginx/templates \
  NGINX_ENVSUBST_OUTPUT_DIR=/tmp \
  NGINX_LISTEN_SSL="" \
  NGINX_SSL_CERTIFICATE="" \
  NGINX_SSL_CERTIFICATE_FILE="" \
  NGINX_SSL_PROTOCOLS="" \
  NGINX_SSL_CIPHERS=""

COPY --from=build /app/sbom.spdx.json /usr/share/sbom.spdx.json

COPY --from=build --chown=nginx:nginx /app/dist/apps/dh/app-dh/browser /usr/share/nginx/html
COPY --from=build --chown=nginx:nginx /app/dist/apps/dh/app-dh/3rdpartylicenses.txt /usr/share/nginx/html
COPY --chown=nginx:nginx apps/dh/app-dh/nginx.conf /etc/nginx/templates/default.conf.template
COPY --chown=nginx:nginx apps/dh/app-dh/include-default-conf.conf /etc/nginx/conf.d/include-default-conf.conf

RUN rm /etc/nginx/conf.d/default.conf \
  && mkdir -p /etc/nginx/ssl

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
