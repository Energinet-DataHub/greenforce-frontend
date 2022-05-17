import { Component, OnInit, NgModule } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import {
  WattButtonModule,
} from '@energinet-datahub/watt';

@Component({
  selector: 'dh-dh-wholesale-start',
  templateUrl: './dh-wholesale-start.component.html',
  styleUrls: ['./dh-wholesale-start.component.scss']
})
export class DhWholesaleStartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

@NgModule({
  imports: [
    WattButtonModule,
    TranslocoModule
  ],
  declarations: [DhWholesaleStartComponent],
})
export class DhWholesaleStartScam {}
