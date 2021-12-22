import {LiveAnnouncer} from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, NgModule, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { WattIconModule, WattIconSize } from '@energinet-datahub/watt';
import { ConnectionState, MeteringPointSimpleCimDto, MeteringPointType } from '@energinet-datahub/dh/shared/data-access-api';
import { TranslocoModule } from '@ngneat/transloco';
import { DhMeteringPointStatusBadgeScam } from '../status-badge/dh-metering-point-status-badge.component';

@Component({
  selector: 'dh-child-metering-point',
  templateUrl: './dh-child-metering-point.component.html',
  styleUrls: ['./dh-child-metering-point.component.scss']
})
export class DhChildMeteringPointComponent{
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  iconSize = WattIconSize
  @Input()
  childMeteringPoints: Array<MeteringPointSimpleCimDto> = this.testData()
  // constructor(private _liveAnnouncer: LiveAnnouncer) {}
  
  // @ViewChild(MatSort) sort: MatSort;
  
  // ngAfterViewInit() {
  //   this.childMeteringPoints.sort = this.sort;
  // }

  // announceSortChange(sortState: Sort) {
  //   // This example uses English messages. If your application supports
  //   // multiple language, you would internationalize these strings.
  //   // Furthermore, you can customize the message to add additional
  //   // details about the values being sorted.
  //   if (sortState.direction) {
  //     this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
  //   } else {
  //     this._liveAnnouncer.announce('Sorting cleared');
  //   }
  // }

  private testData(){
    const td: Array<MeteringPointSimpleCimDto> = []
    const mpscd: MeteringPointSimpleCimDto = {
      gsrnNumber: '1234',
      effectiveDate: '2020-01-01T00:00:00Z',
      connectionState: ConnectionState.D03,
      meteringPointId: '5678',
      meteringPointType: MeteringPointType.D01
    }
    td.push(mpscd)
    td.push(mpscd)
    td.push(mpscd)
    return td
  }
}

@NgModule({
  declarations: [DhChildMeteringPointComponent],
  imports: [
    MatTableModule,
    TranslocoModule,
    DhMeteringPointStatusBadgeScam,
    WattIconModule
  ],
  exports: [DhChildMeteringPointComponent],
})
export class DhChildMeteringPointComponentScam {}
