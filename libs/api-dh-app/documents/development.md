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

We use [Swashbuckle](https://github.com/domaindrivendev/Swashbuckle.AspNetCore) to:

* Expose a Swagger UI and an OpenAPI v3 endpoint.

This functionality is only enabled when:

* The ASP.NET Core environment is set to `development`. See the `Configure` method in [Startup.cs](../source/DataHub.WebApi/Startup.cs).