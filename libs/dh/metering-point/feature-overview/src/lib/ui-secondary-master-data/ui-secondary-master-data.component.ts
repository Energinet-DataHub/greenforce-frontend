import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { MeteringPointCimDto } from '@energinet-datahub/dh/shared/data-access-api';
import { WattExpansionModule, WattIconModule } from '@energinet-datahub/watt';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'dh-ui-secondary-master-data',
  templateUrl: './ui-secondary-master-data.component.html',
  styleUrls: ['./ui-secondary-master-data.component.scss']
})
export class UiSecondaryMasterDataComponent{
  @Input() secondaryMasterData: MeteringPointCimDto = {};

}

@NgModule({
  declarations: [UiSecondaryMasterDataComponent],
  imports: [WattExpansionModule, CommonModule, TranslocoModule, WattIconModule],
  exports: [UiSecondaryMasterDataComponent]
})
export class UiSecondaryMasterDataComponentScam {}