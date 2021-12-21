import { Component, Input, NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MeteringPointSimpleCimDto } from '@energinet-datahub/dh/shared/data-access-api';

@Component({
  selector: 'dh-child-metering-point',
  templateUrl: './dh-child-metering-point.component.html',
  styleUrls: ['./dh-child-metering-point.component.scss']
})
export class DhChildMeteringPointComponent{
  @Input()
  childMeteringPoints: Array<MeteringPointSimpleCimDto> = []
}

@NgModule({
  declarations: [DhChildMeteringPointComponent],
  imports: [
    MatTableModule
  ],
  exports: [DhChildMeteringPointComponent],
})
export class DhChildMeteringPointComponentScam {}
