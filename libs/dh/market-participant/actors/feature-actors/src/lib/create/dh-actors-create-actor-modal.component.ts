import { Component, ViewChild } from '@angular/core';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  standalone: true,
  selector: 'dh-actors-create-actor-modal',
  templateUrl: './dh-actors-create-actor-modal.component.html',
  imports: [WATT_MODAL, TranslocoDirective],
})
export class DhActorsCreateActorModalComponent {
  @ViewChild(WattModalComponent)
  innerModal: WattModalComponent | undefined;

  open() {
    this.innerModal?.open();
  }

  close() {
    this.innerModal?.close(false);
  }
}
