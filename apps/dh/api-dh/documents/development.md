# Development

Notes regarding the development of the DataHub Backend-For-Frontend (BFF).

## Setup of BFF

Before you're able to run the BFF locally you need an `appsettings.Development.json`
file in the `apps/dh/api-dh/source/DataHub.WebApi/` folder. Either create one from
`apps/dh/api-dh/source/DataHub.WebApi/appsettings.Development.json.sample` or if
you are an internal DataHub employee, take a loot at the
[`dev-secrets`](https://github.com/Energinet-DataHub/dev-secrets) repository.

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

## OpenAPI

We use [Swashbuckle](https://github.com/domaindrivendev/Swashbuckle.AspNetCore) to expose a Swagger UI and an OpenAPI v3 endpoint. This is configured in [Startup.cs](../source/DataHub.WebApi/Startup.cs).

To get started, see [Get started with Swashbuckle and ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/tutorials/getting-started-with-swashbuckle?view=aspnetcore-5.0&tabs=visual-studio).

## API Versioning

**TODO: We need to decide on a standard/format and update this section.**

We must have a version in all url's following a format like `\v1\`.
