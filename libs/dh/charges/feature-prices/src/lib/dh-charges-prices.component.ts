import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dh-charges-prices',
  templateUrl: './dh-charges-prices.component.html',
  styleUrls: ['./dh-charges-prices.component.scss']
})
export class DhChargesPricesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

@NgModule({
  declarations: [DhChargesPricesComponent],
  imports: [
    CommonModule
  ],
})
export class DhChargesPricesScam {}
