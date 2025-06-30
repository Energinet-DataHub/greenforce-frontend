# Development

Notes regarding the development of the DataHub Backend-For-Frontend (BFF).

## Guides

Following is a list of development guides on specific topics:

  * [Revision Log](./revision-log.md) - How to work with revision log in the BFF

## Introduction

The BFF exposes two different services, a GraphQL API using
[Hot Chocolate] and a REST API built with ASP.NET Core MVC.
The primary data fetching should be done using GraphQL,
but there are exceptions where the REST API is a better fit.
For example, GraphQL is not a great protocol for file downloads, so
in those cases the downloads are handled by the REST API instead.

### Active feature flags

In the following table we list active feature flags, and when they should be removed.

| Name | Purpose | Must be removed when |
| ---- | ------- | -------------------- |
| -    | -       | -                    |

The feature flags implementation in .NET follows the [FeatureManagement guidelines],
and was initially created following the [FeatureManagement quickstarts].

## Setup of BFF

Before you're able to run the BFF locally you need an
`appsettings.json` file within the [`DataHub.WebApi`] folder.
Either create one from the [sample file] or if you are an internal
DataHub employee, take a look at the [dh3-dev-secrets] repository.

## GraphQL

This section serves as a brief introduction on how to use GraphQL
in the BFF. For more technical documentation regarding the C# part,
visit the [Hot Chocolate] website.

### Playground

When the BFF is running locally, it is possible to test queries in the
playground. To do so, navigate to [localhost:5001/graphql] in the browser.
Most queries need an `Authorization` header to be set with a Bearer token,
which can be obtained by inspecting network calls in the [dev environment]
and copying it.

### Codegen

The GraphQL server exposes a schema which is used to generate TypeScript
files for the frontend. The code generation is handled by [GraphQL Code Generator]
and must be run whenever new functionality in the GraphQL server needs
to be tested in the frontend. When working with a feature involving both
server and client, use the following command to automatically start the
client and run the code generation whenever the source files change:

```sh
bun dh:dev
```

It is also possible to run the code generation manually (order is important):

```sh
bun nx run api-dh:generate
bun nx run dh-shared-domain:generate
```

The `api-dh:generate` command will generate a `schema.graphql`
file in `libs/dh/shared/data-access-graphql`. This file is used by the
`dh-shared-domain:generate` command as well as the VS Code GraphQL
extension (to provide IntelliSense in `.graphql` files).

#### Verify new generated GraphQL schema

If there is any changes to the GraphQL schema, the new schema must be verified. To verify the generated `.graphql` schema, you need to:

- Run the dotnet unit test `Energinet.DataHub.WebApi.Tests.Integration.GraphQL.SchemaTests.ChangeTest`
- Update the `apps\dh\api-dh\source\DataHub.WebApi.Tests\Snapshots\SchemaTests.ChangeTest.verified.graphql` so it is equal to the generated schema
    - The test automatically launches the `diff` viewer if ran in Visual Studio or Rider, which helps you merge the changes into the verified file

See the [Testing] section for additional info.

### Creating a new query

To create a new query using Hot Chocolate, follow this example:

1. Define the data model class (skip this if using an existing DTO):

    ```csharp
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
    }
    ```

2. In the `Query.cs` file, add a new `GetBooks` method:

    ```csharp
    public class Query
    {
        public IEnumerable<Book> GetBooks() =>
            new List<Book>
            {
                new Book { Id = 1, Title = "The Great Gatsby", Author = "F. Scott Fitzgerald" },
                new Book { Id = 2, Title = "To Kill a Mockingbird", Author = "Harper Lee" }
            }

        // ...
    }
    ```

3. Restart the server and it should now be possible to query
   the list of books in the [playground](#playground).

### Testing

Our GraphQL testing setup uses snapshots to check for changes in schema and payloads. Since the
GraphQL server heavily relies on inferring types from client services, we need to be thorough
in testing the entire schema for any unexpected field updates. If the new schema doesn't match the
stored snapshot exactly, this test will fail.

To determine if any changes have occurred in the snapshots, execute the following command:

```sh
bun api:test
```

If the tests fail because of snapshot mismatches, you should see a diff in the console, and one or
more `.received.` files will appear inside the `Snapshots` folder, located at
`apps/dh/api-dh/source/DataHub.WebApi.Tests/Snapshots`. You can either resolve the differences
manually or use the following tool:

```sh
bun api:verify
```

Take a close look at the changes. If they're intentional, accept the changes from the `.received.`
file. If the changes weren't intentional, reject the changes and fix the problem in the server
code. Once the differences have been resolved, rerun the test command and the tests should now pass.

#### Telemetry Tests

The telemetry integration tests run separately from the rest of the test since they use an actual
application insights endpoint, making the tests run slower and require authentication with Azure.

In order to run the telemetry tests locally, you need to first
[install Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) and then login:

```sh
az login
```

When that is done, it should be possible to run the telemetry tests using this command:

```sh
bun api:test:telemetry
```

Keep in mind that these tests usually takes about 3-5 minutes, but may run for as long as 20 minutes.

### Evolution over versioning

The GraphQL API uses schema evolution instead of the traditional
number versioning. This means that breaking changes are avoided
by introducing new fields (and deprecating old fields) instead
of updating existing fields.

## REST

### Generating subsystem clients

The BFF API uses generated clients to communicate with other subsystems. These are generated from `swagger.json` files using NSwag.

#### Current subsystem clients

The current subsystem clients can be found at:

- apps\dh\api-dh\source\DataHub.WebApi\Clients\EDI
- apps\dh\api-dh\source\DataHub.WebApi\Clients\ESettExchange
- apps\dh\api-dh\source\DataHub.WebApi\Clients\ImbalancePrices
- apps\dh\api-dh\source\DataHub.WebApi\Clients\MarketParticipant

#### Update subsystem clients

Update the subsystem clients using NSwag:

- Delete the respective `swagger.json` file, eg. `apps/dh/api-dh/source/DataHub.WebApi/Clients/<subsystem>/V3/swagger.json`
- Make sure you have access to the `swagger.json` source mentioned in the respective `nswag.json` file. **You might have to connect using VPN.** Example from the `apps/dh/api-dh/source/DataHub.WebApi/Clients/<subsystem>/V3/nswag.json` config:

    ```json
    {
        ...
        "documentGenerator": {
            "fromDocument": {
            "url": "https://app-api-markpart-d-we-001.azurewebsites.net/swagger/v3/swagger.json",
            "output": "swagger.json",
            "newLineBehavior": "Auto"
            }
        },
        ...
    }
    ```

- Build the `DataHub.WebApi` dotnet project

### OpenAPI

We use [Swashbuckle] to expose a Swagger UI and an OpenAPI v3 endpoint.
This is configured in [Startup.cs].

To get started, see [Get started with Swashbuckle and ASP.NET Core][Swashbuckle-get-started].

### Versioning

The REST API is versioned using the URL, which means all endpoints start
with the version (e.g. `\v1\`).

[`DataHub.WebApi`]: ../source/DataHub.WebApi/
[Startup.cs]: ../source/DataHub.WebApi/Startup.cs
[sample file]: ../source/DataHub.WebApi/appsettings.json.sample
[localhost:5001/graphql]: https://localhost:5001/graphql
[dh3-dev-secrets]: https://github.com/Energinet-DataHub/dh3-dev-secrets
[dev environment]: https://jolly-sand-03f839703.azurestaticapps.net
[Hot Chocolate]: https://chillicream.com/docs/hotchocolate/v13
[Swashbuckle]: https://github.com/domaindrivendev/Swashbuckle.AspNetCore
[Swashbuckle-get-started]: https://learn.microsoft.com/en-us/aspnet/core/tutorials/getting-started-with-swashbuckle
[GraphQL Code Generator]: https://the-guild.dev/graphql/codegen
[Testing]: ./development.md#testing
[FeatureManagement guidelines]: https://github.com/Energinet-DataHub/geh-core/blob/main/source/FeatureManagement/documents/documentation.md
[FeatureManagement quickstarts]: https://github.com/Energinet-DataHub/geh-core/blob/main/source/FeatureManagement/documents/quickstarts-feature-flag.md
