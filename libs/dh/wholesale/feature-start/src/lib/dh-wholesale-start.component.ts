import { Component, OnInit, NgModule } from '@angular/core';
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
    WattButtonModule
  ],
  declarations: [DhWholesaleStartComponent],
})
export class DhWholesaleStartScam {}
