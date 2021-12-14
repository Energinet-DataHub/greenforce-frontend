import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { WattExpansionModule } from '@energinet-datahub/watt';
import { TranslocoModule } from '@ngneat/transloco';
import { SecondaryMasterData } from './secondary-master-data';

@Component({
  selector: 'dh-ui-secondary-master-data',
  templateUrl: './ui-secondary-master-data.component.html',
  styleUrls: ['./ui-secondary-master-data.component.scss']
})
export class UiSecondaryMasterDataComponent{
  @Input() secondaryMasterData: SecondaryMasterData = {
    netSettlementGroup: undefined,
    disconnectionType: undefined,
    connectionType: undefined,
    gridAreaName: undefined,
    gridAreaCode: undefined,
    capacity: undefined,
    assetType: undefined,
    ratedCapacity: undefined,
    ratedCurrent: undefined,
    gsrnNumber: undefined,
    productId: undefined,
    streetCode: undefined,
    municipalityCode: undefined,
    countryCode: undefined
  };

}

@NgModule({
  declarations: [UiSecondaryMasterDataComponent],
  imports: [WattExpansionModule, CommonModule, TranslocoModule],
  exports: [UiSecondaryMasterDataComponent]
})
export class UiSecondaryMasterDataComponentScam {}