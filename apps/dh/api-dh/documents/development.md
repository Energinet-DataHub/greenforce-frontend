# Development notes

Notes regarding the development of the DataHub Backend-for-frontend (BFF).

## Setup of BFF

Before you're able to run the BFF locally you need to copy
`build/ci/dh/api-dh/ci.appsettings.Development.json` ->
`apps/dh/api-dh/source/DataHub.WebApi/appsettings.Development.json`.
If you're using PowerShell Core or another Terminal that supports `cp`,
you can do it with:

```sh
yarn nx run api-dh:ci-configuration
```

Otherwise you need to do the copying manually. This should be done everytime a
new client is added.

## Generating HttpClient and DTOs

After the BFF is built, a Swagger definition file is generated. This file is
used to auto-generate any HttpClients and DTOs needed to communicate with the
BFF. To do that run:

```sh
yarn nx run api-dh:build-client
```

*Note: The files are automatically placed in
`libs/dh/shared/domain/src/lib/generated/v1/**`. You **must not** modify these
files manually.*

## Workflows

> Describe BFF relevant workflows here.

### `license-check-ci.yml`

This workflow verifies all files has a license header.

It can also:

- Automatically add a license header to files for which it is missing, but will ignore apps of type `api`.

### `frontend-ci.yml`

This workflow builds, lint, format and runs tests for the frontend applications and design system.

- Applications of type `api` are ignored from the `.prettierignore` file. This is done automatically as long as the naming convention is followed `api-<application name>`.

### `api-dh-ci.yml`

This workflow verifies the ASP.NET Core Web API by building and running all tests.

## Setup local environment

Add appsettings.Development.json with valid settings:

`ApiClientSettings`  
`> MeteringPointBaseUrl`  
`> ChargesBaseUrl`  
`> MessageArchiveBaseUrl`  
`> MarketParticipantBaseUrl`  
`> WholesaleBaseUrl`  
`FRONTEND_SERVICE_APP_ID`  
`FRONTEND_OPEN_ID_URL`

## OpenAPI

We use [Swashbuckle](https://github.com/domaindrivendev/Swashbuckle.AspNetCore) to expose a Swagger UI and an OpenAPI v3 endpoint. This is configured in [Startup.cs](../source/DataHub.WebApi/Startup.cs).

To get started, see [Get started with Swashbuckle and ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/tutorials/getting-started-with-swashbuckle?view=aspnetcore-5.0&tabs=visual-studio).

## API Versioning

**TODO: We need to decide on a standard/format and update this section.**

We must have a version in all url's following a format like `\v1\`.
