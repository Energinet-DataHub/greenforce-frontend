import { Component, Input, NgModule, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatSortable, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { WattIconModule, WattIconSize } from '@energinet-datahub/watt';
import { ConnectionState, MeteringPointSimpleCimDto, MeteringPointType } from '@energinet-datahub/dh/shared/data-access-api';
import { TranslocoModule } from '@ngneat/transloco';
import { DhMeteringPointStatusBadgeScam } from '../status-badge/dh-metering-point-status-badge.component';

const TestData: MeteringPointSimpleCimDto[] = [
  {gsrnNumber: '123', effectiveDate: '2020-01-02T00:00:00Z', connectionState: ConnectionState.D03, meteringPointId: '5678', meteringPointType: MeteringPointType.D01},
  {gsrnNumber: '910', effectiveDate: '2020-04-01T00:00:00Z', connectionState: ConnectionState.D02, meteringPointId: '546', meteringPointType: MeteringPointType.D02},
  {gsrnNumber: '678', effectiveDate: '2020-01-03T00:00:00Z', connectionState: ConnectionState.E22, meteringPointId: '125', meteringPointType: MeteringPointType.D09},
  {gsrnNumber: '345', effectiveDate: '2020-02-02T00:00:00Z', connectionState: ConnectionState.E23, meteringPointId: '558', meteringPointType: MeteringPointType.D13}
]

@Component({
  selector: 'dh-child-metering-point',
  templateUrl: './dh-child-metering-point.component.html',
  styleUrls: ['./dh-child-metering-point.component.scss']
})
export class DhChildMeteringPointComponent implements AfterViewInit{
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  iconSize = WattIconSize
  sortedData: Array<MeteringPointSimpleCimDto> = []
  @Input()
  childMeteringPoints: Array<MeteringPointSimpleCimDto> = TestData

  @ViewChild(MatSort) matSort!: MatSort;

  ngAfterViewInit(): void {
    this.setDefaultSorting();
  }

  sortData(sort: Sort) {
    const data = this.childMeteringPoints.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      this.setDefaultSorting();
      return;
    }
    
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'childMeteringPoint':
          return this.compare(a.gsrnNumber, b.gsrnNumber, isAsc);
        case 'effectivePeriod':
          return this.compare(a.effectiveDate, b.effectiveDate, isAsc);
        case 'status':
          return this.compare(a.connectionState, b.connectionState, isAsc);
        default:
          return 0;
      }
    });
  }
  setDefaultSorting(){
    this.matSort.sort(this.matSort.sortables.get('childMeteringPoint') as MatSortable);
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}

@NgModule({
  declarations: [DhChildMeteringPointComponent],
  imports: [
    MatTableModule,
    TranslocoModule,
    DhMeteringPointStatusBadgeScam,
    WattIconModule,
    MatSortModule
  ],
  exports: [DhChildMeteringPointComponent],
})
export class DhChildMeteringPointComponentScam {}
