import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { RxPush } from '@rx-angular/template/push';
import { delay, distinctUntilChanged, map, tap, Observable, ReplaySubject } from 'rxjs';

import { WattButtonComponent } from '../../button';
import { WattSpinnerComponent } from '../../spinner';
import { WattDrawerComponent, WATT_DRAWER } from '../watt-drawer.component';

@Component({
  standalone: true,
  imports: [WattButtonComponent, WattSpinnerComponent, WATT_DRAWER, RxPush],
  selector: 'watt-storybook-drawer-loading',
  template: `
    <watt-drawer #drawer size="small" [loading]="loading" (closed)="onClose()">
      <watt-drawer-topbar>
        @if (drawer.isOpen) {
          <span>Top bar</span>
        }
      </watt-drawer-topbar>

      <watt-drawer-actions>
        <watt-button variant="secondary">Secondary action</watt-button>
        <watt-button>Primary action</watt-button>
      </watt-drawer-actions>

      @if (drawer.isOpen) {
        <watt-drawer-content>{{ content$ | push }}</watt-drawer-content>
      }
    </watt-drawer>
    <watt-button (click)="open('first')">Open first</watt-button>
    <br />
    <br />
    <watt-button (click)="open('second')">Open second</watt-button>
  `,
})
export class WattStorybookDrawerLoadingComponent {
  private id$ = new ReplaySubject<string>(1);

  content$: Observable<string>;
  loading = false;

  @Output() closed = new EventEmitter<void>();

  @ViewChild('drawer') drawer!: WattDrawerComponent;

  constructor() {
    this.content$ = this.id$.pipe(
      distinctUntilChanged<string>(),
      tap(() => {
        // Avoid `ExpressionChangedAfterItHasBeenCheckedError` in the wrapping component
        setTimeout(() => (this.loading = true));
      }),
      delay(1000),
      tap(() => (this.loading = false)),
      map((id) => `This is the ${id} drawer`)
    );
  }

  open(id: string) {
    this.drawer.open();
    this.id$.next(id);
  }

  onClose() {
    this.closed.emit();
  }
}
