import { Component, OnInit, inject } from '@angular/core';
import { WattButtonComponent } from '../../button/watt-button.component';
import { WATT_MODAL } from '../watt-modal.component';
import { WattTypedModal, WattModalService } from '../watt-modal.service';
import { WattTextFieldComponent } from '../../text-field/watt-text-field.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [WATT_MODAL, WattTextFieldComponent, WattButtonComponent, ReactiveFormsModule],
  template: `
    <watt-modal #modal [title]="title" closeLabel="Close modal" [loading]="isLoading">
      <p>{{ modalData }}</p>
      <watt-text-field [formControl]="usernameControl" label="Username" />
      <watt-text-field [formControl]="passwordControl" label="Password" type="password" />
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">Cancel</watt-button>
        <watt-button (click)="modal.close(true)">Save</watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class WattModalComponent extends WattTypedModal<string> implements OnInit {
  title = 'This is a modal opened from a class';
  usernameControl = new FormControl('');
  passwordControl = new FormControl('');
  isLoading = false;

  ngOnInit(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
    }, 300);
  }
}

@Component({
  standalone: true,
  selector: 'watt-modal-from-class',
  imports: [WattButtonComponent, WattModalComponent],
  providers: [WattModalService],
  template: `<watt-button (click)="openModal()">Open modal from service</watt-button>`,
})
export class WattModalFromClassComponent {
  private modalService = inject(WattModalService);

  openModal() {
    this.modalService.open({
      component: WattModalComponent,
      data: 'This is the data passed to the modal',
      onClosed: (result) => {
        alert(`Modal closed with result: ${result}`);
      },
    });
  }
}
