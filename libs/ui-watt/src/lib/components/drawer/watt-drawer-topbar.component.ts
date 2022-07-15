import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'watt-drawer-topbar',
  template: `
    <ng-content></ng-content>
    <watt-button
      class="close-btn"
      variant="icon"
      icon="close"
      (click)="closed.emit()"
    ></watt-button>
  `,
  styleUrls: ['./watt-drawer-topbar.component.scss'],
})
export class WattDrawerTopbarComponent {
  @Output() closed = new EventEmitter<void>();
}
