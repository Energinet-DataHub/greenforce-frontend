import { Pipe, PipeTransform } from '@angular/core';
import { WattTableDataSource } from '@energinet-datahub/watt/table';

@Pipe({
  name: 'wattDataSource',
  standalone: true,
})
export class WattDataSourcePipe implements PipeTransform {
  transform<T>(data: T[], dataSource: WattTableDataSource<T>): WattTableDataSource<T> {
    dataSource.data = data;
    return dataSource;
  }
}
