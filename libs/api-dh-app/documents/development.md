# Development notes

Notes regarding the development of the DataHub Backend-for-frontend (BFF).

## Workflows

> Describe BFF relevant workflows here.

### `license-check-ci.yml`

This workflow verifies all files has a license header.

It can also automatically add a license header to files for which it is missing, but will ignore file patterns specified in the `.nxignore` file.

## Setup local envioment

> Describe necessary setup here.

## OpenAPI

We use [Swashbuckle](https://github.com/domaindrivendev/Swashbuckle.AspNetCore) to expose a Swagger UI and an OpenAPI v3 endpoint. This is configured in [Startup.cs](../source/DataHub.WebApi/Startup.cs).

To get started, see [Get started with Swashbuckle and ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/tutorials/getting-started-with-swashbuckle?view=aspnetcore-5.0&tabs=visual-studio).