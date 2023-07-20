import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { PushModule } from '@rx-angular/template/push';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { EoTransfersFormComponent } from './eo-transfers-form.component';
import { EoAuthStore } from '@energinet-datahub/eo/shared/services';
import {WattFormFieldComponent} from "@energinet-datahub/watt/form-field";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {catchError, of} from "rxjs";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-transfers-wallet-modal',
  imports: [
    WATT_MODAL,
    WattValidationMessageComponent,
    MatInputModule,
    NgIf,
    EoTransfersFormComponent,
    PushModule,
    WattFormFieldComponent,
    MatFormFieldModule,
  ],
  standalone: true,
  template: `
    <watt-modal
      #modal
      title="Create Wallet Deposit Endpoint"
      [size]="'small'"
      closeLabel="Close modal"
      (closed)="onClosed()"
      *ngIf="opened"
    >
      <ng-container *ngIf="!responseVisible">
        <p>
          To receive granular certificates, the sender must create a transfer agreement.
          They need this key to identify the recipient (you).
        </p>

        <button
          wattButton
          variant="primary"
          (click)="createWalletDepositEndpoint()"
        >
          Create Wallet Deposit Endpoint
        </button>
      </ng-container>

      <ng-container *ngIf="responseVisible">
        <div class="response-container">
          <mat-form-field appearance="fill" class="response-field">
        <textarea
          matInput
          [readonly]="true"
          [value]="form.controls.depositEndpointResponse.value"
          rows="6"
        ></textarea>
          </mat-form-field>
          <button
            class="copy-button"
            (click)="copyToClipboard()"
          >
            Copy
          </button>
        </div>
      </ng-container>
    </watt-modal>
  `,
  styles: [
    `
      .copy-button {
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        color: #333;
        cursor: pointer;
        font-size: 14px;
        padding: 6px 12px;
      }

      .copy-button:hover {
        background-color: #f5f5f5;
      }

      .response-container {
        display: flex;
        gap: 16px;
        align-items: center;
      }

      .response-field {
        flex-grow: 1;
      }

      textarea {
        width: 100%;
      }
    `
  ]

})
export class EoTransfersWalletModalComponent {
  @ViewChild(WattModalComponent) modal!: WattModalComponent;
  protected opened = false;
  protected form: FormGroup;
  protected responseVisible = false;


  constructor(
    private cd: ChangeDetectorRef,
    private httpClient: HttpClient,
    protected authStore: EoAuthStore
  ) {
    this.form = new FormGroup({
      depositEndpointResponse: new FormControl('')
    });
  }

  open() {
    this.opened = true;
    this.responseVisible = false;
    this.cd.detectChanges();
    this.modal.open();
  }

  onClosed() {
    this.opened = false;
    this.responseVisible = false;
  }

  createWalletDepositEndpoint() {
    const bearerToken = this.authStore.token.getValue();
    const headers = {
      Accept: 'text/plain',
      Authorization: `Bearer ${bearerToken}`
    };

    this.httpClient
      .post('https://demo.energioprindelse.dk/api/transfer-agreements/wallet-deposit-endpoint', {}, { headers })
      .pipe(
        catchError((error: any) => {
          // Handle error if necessary
          return of(error); // Return an observable with the error
        })
      )
      .subscribe(
        (response: any) => {
          this.form.controls['depositEndpointResponse'].setValue(response.result);
          this.responseVisible = true; // Show the response text box
          this.cd.detectChanges(); // Trigger change detection
        },
        (error: any) => {
          // Handle error if necessary
        }
      );
  }


  copyToClipboard() {
    const textarea = document.createElement('textarea');
    textarea.value = this.form.controls['depositEndpointResponse'].value;
    document.body.appendChild(textarea);
    textarea.select();

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textarea.value)
        .then(() => {
          // Success feedback or additional logic
          console.log('Text copied to clipboard successfully');
        })
        .catch((error) => {
          // Error handling
          console.error('Failed to copy text to clipboard:', error);
        });
    } else {
      // Fallback for older browsers
      document.execCommand('copy');
    }

    document.body.removeChild(textarea);
  }
}
