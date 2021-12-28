import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dh-charges',
  templateUrl: './dh-charges.component.html',
  styleUrls: ['./dh-charges.component.scss'],
})
export class DhChargesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

@NgModule({
  imports: [CommonModule],
  declarations: [DhChargesComponent],
  exports: [DhChargesComponent],
})
export class DhChargesComponentModule {}
