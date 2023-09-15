# Development

Notes regarding the development of the DataHub Backend-For-Frontend (BFF).

## Introduction

The BFF exposes two different services, a GraphQL API using
[Hot Chocolate] and a REST API built with ASP.NET Core MVC.
The primary data fetching should be done using GraphQL,
but there are exceptions where the REST API is a better fit.
For example, GraphQL is not a great protocol for file downloads, so
in those cases the downloads are handled by the REST API instead.

## Setup of BFF

Before you're able to run the BFF locally you need an
`appsettings.Development.json` file within the [`DataHub.WebApi`] folder.
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
to be tested in the frontend. To generate the code, make sure the local
GraphQL server is running and then execute the following command:

```sh
yarn generate-graphql-schema
```

The code generator will also generate a `schema.graphql` file in the root
folder. This file is used by the VS Code GraphQL extension to provide
IntelliSense in `.graphql` files and should be checked in to remote along
with the other files.

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

## Testing

Our GraphQL testing setup uses snapshots to check for changes in schema and payloads. Since the
GraphQL server heavily relies on inferring types from client interactions, we need to be thorough
in testing the entire schema for any unexpected field updates. If the new schema doesn't match the
stored snapshot exactly, this test will fail.

To determine if any changes have occurred in the snapshots, execute the following command:

```sh
yarn nx test api-dh
```

If the tests fail because of snapshot mismatches, you'll see a comparison in the console, and a
`__MISMATCH__` folder will pop up inside the `__snapshots__` folder, located at
`apps/dh/api-dh/source/DataHub.WebApi.Tests/Integration/GraphQL`.

Take a close look at the changes. If they're intentional, you can simply replace the file(s) in the
`__snapshots__` folder with the ones in the `__MISMATCH__` folder (they have the same names, so
dragging and dropping should work). If the changes weren't intentional, fix the problem in the
server code, and then rerun the test command. The files in `__MISMATCH__` will automatically be
deleted as soon as their corresponding tests passes.

### Evolution over versioning

The GraphQL API uses schema evolution instead of the traditional
number versioning. This means that breaking changes are avoided
by introducing new fields (and deprecating old fields) instead
of updating existing fields.

## REST

### Generating HttpClient and DTOs

After the BFF is built, a Swagger definition file is generated. This file is
used to auto-generate any HttpClients and DTOs needed to communicate with the
BFF. To do that run:

```sh
yarn nx run api-dh:build-client
```

*Note: The files are automatically placed in
`libs/dh/shared/domain/src/lib/generated/v1/**`. You **must not** modify these
files manually.*

### OpenAPI

We use [Swashbuckle] to expose a Swagger UI and an OpenAPI v3 endpoint.
This is configured in [Startup.cs].

To get started, see [Get started with Swashbuckle and ASP.NET Core][Swashbuckle-get-started].

### Versioning

The REST API is versioned using the URL, which means all endpoints start
with the version (e.g. `\v1\`).

[`DataHub.WebApi`]: ../source/DataHub.WebApi/
[Startup.cs]: ../source/DataHub.WebApi/Startup.cs
[sample file]: ../source/DataHub.WebApi/appsettings.Development.json.sample
[localhost:5001/graphql]: https://localhost:5001/graphql
[dh3-dev-secrets]: https://github.com/Energinet-DataHub/dh3-dev-secrets
[dev environment]: https://jolly-sand-03f839703.azurestaticapps.net
[Hot Chocolate]: https://chillicream.com/docs/hotchocolate/v13
[Swashbuckle]: https://github.com/domaindrivendev/Swashbuckle.AspNetCore
[Swashbuckle-get-started]: https://learn.microsoft.com/en-us/aspnet/core/tutorials/getting-started-with-swashbuckle
[GraphQL Code Generator]: https://the-guild.dev/graphql/codegen
