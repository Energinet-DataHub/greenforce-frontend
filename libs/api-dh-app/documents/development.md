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

We use [NSwag](https://github.com/RicoSuter/NSwag) to:

* Expose a Swagger UI and an OpenAPI v3 endpoint.
* Auto generate type script API clients for use by the DataHub Angular frontend.

This functionality is only enabled when:

* The ASP.NET Core environment is set to `development`. See the `Configure` method in [Startup.cs](../source/DataHub.WebApi/Startup.cs).
* The project is build using the configuration `debug`. See the `NSwag` target in [DataHub.WebApi.csproj](../source/DataHub.WebApi/DataHub.WebApi.csproj)

### Generate API clients

We use [NSwag.MSBuild](https://github.com/RicoSuter/NSwag/wiki/NSwag.MSBuild) to generate the type script API clients during build of the `DataHub.WebApi` project.

The generator is configured using the [nswag.json](../source/DataHub.WebApi/nswag.json) file.

Notice the following important settings:

* `aspNetCoreToOpenApi`:

  * `project`: the ASP.NET Core project that is reflected and used as input.
  * `output`: the file to which the generated OpenAPI specification is written.

* `openApiToTypeScriptClient`

  * `output`: the file to which the generated type script clients are written.
