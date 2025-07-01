# Revision Log

The BFF offers middleware support for operations needing a revision log, streamlining the process
significantly. To implement it, just tag the operation method with the `[UseRevisionLog]` attribute.
Here's an example:

```csharp
public static partial class BookOperations
{
    [Query]
    [UseRevisionLog]
    public static async Task<Book> GetBookByIdAsync(Guid id, IBooksClient client) =>
        await client.GetBookByIdAsync(id);
}
```

Using this tag, the operation will send necessary data to the revision log before executing further.
It automatically gathers information like "payload" and "activity". However, specific details about
the "affected entity" require a consistent naming pattern for the `[UseRevisionLog]` attribute to
understand them correctly.

First, there's the "affected entity type," which, in this case, is "Book". This is deduced
automatically from the class name (BookOperations) by removing conventional suffixes like Node,
Operations, Queries, Mutations, and Subscriptions. [[Source]](https://github.com/Energinet-DataHub/greenforce-frontend/blob/52a66634e0081b37fc03efb2125238bcdb4e9ec6/apps/dh/api-dh/source/DataHub.WebApi/Modules/RevisionLog/Attributes/UseRevisionLog.cs#L38)

Second, the "affected entity key", is automatically determined from the method parameters.
Make sure there is a parameter named `id` if the operation affects a single entity.

## Test

Because some of the data collection relies on precise naming conventions, it's crucial to test any
use of the `[UseRevisionLog]` attribute to verify correct data collection. A "coverage test" is set up
to fail if an operation is tagged with `[UseRevisionLog]` without a corresponding test. To pass this
test again, you'll need to create a new test using the `[RevisionLogTest]` attribute. Here's an example:

```csharp
public class BookRevisionLogTests
{
    [Fact]
    [RevisionLogTest("BookOperations.GetBookByIdAsync")]
    public async Task GetBookByIdAsync()
    {
        var operation =
            $$"""
              query($id: UUID!) {
                bookById(id: $id) {
                  id
                }
              }
            """;

        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            operation,
            new() { { "id", Guid.Parse("0197b1d7-e968-7280-ae80-43e58a5830e4") } });
    }
}
```
