import { Component, NgModule, OnInit } from '@angular/core';
import { DhMarketParticipantEditOrganizationDataAccessApiStore } from '@energinet-datahub/dh/market-participant/data-access-api';
import { WattButtonModule, WattTabsModule } from '@energinet-datahub/watt';

@Component({
  selector: 'dh-market-participant-edit-organization',
  templateUrl: './dh-market-participant-edit-organization.component.html',
  styleUrls: ['./dh-market-participant-edit-organization.component.scss'],
})
export class DhMarketParticipantEditOrganizationComponent implements OnInit {
  constructor(public store: DhMarketParticipantEditOrganizationDataAccessApiStore)  {;}

  ngOnInit(): void {;}
}

@NgModule({
  imports: [WattButtonModule, WattTabsModule],
  exports: [DhMarketParticipantEditOrganizationComponent],
  declarations: [DhMarketParticipantEditOrganizationComponent],
})
export class DhMarketParticipantEditOrganizationScam {}
