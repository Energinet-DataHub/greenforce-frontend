# Paginator Ui

Used for pagination of tables. The component includes translations and consistent behaviour of pagination.

## Usage

1. Import the `DhSharedUiPaginatorComponent` inside a SCAM module or a standalone component:

   ```ts
   imports: [DhSharedUiPaginatorComponent];
   ```

2. Add `<dh-shared-ui-paginator></dh-shared-ui-paginator>` to the template.

3. Get the reference to the paginator instance:

   ```ts
   @ViewChild(DhSharedUiPaginatorComponent) paginator!: DhSharedUiPaginatorComponent;
   ```

4. Connect the data source with the paginator:

   ```ts
   ngAfterViewInit() {
     this.dataSource.paginator = this.paginator.instance;
   }
   ```

## Configuration

| Name            | Description                                                                                                                                | Default                    |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| length          | The length of the total number of items that are being paginated. **Note: using `MatTableDataSource` will overwrite this value**. `number` | `0`                        |
| pageSizeOptions | The set of provided page size options to display to the user. `number[]`                                                                   | `[50, 100, 150, 200, 250]` |
| pageSize        | Number of items to display on a page. `number`                                                                                             | `50`                       |

## MatTableDataSource

The built-in `MatTableDataSource` is designed for filtering, sorting and pagination of a **client-side** data array.
For server-side filtering, sorting and pagination a custom data source is necessary [Read more.](https://blog.angular-university.io/angular-material-data-table)
