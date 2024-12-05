import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { translations } from '@energinet-datahub/eo/translations';
import { TranslocoPipe } from '@ngneat/transloco';
import { WattFieldErrorComponent, WattFieldHintComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { FormMode } from './eo-transfers-form.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'eo-receiver-input',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoPipe,
    WattFieldErrorComponent,
    WattFieldHintComponent,
    WattTextFieldComponent,
  ],
  styles: [``],
  template: `
    <div class="receiver">
      @if (mode === 'create') {
        <h3 class="watt-headline-2">
          {{ translations.createTransferAgreementProposal.parties.titleBetween | transloco }}
        </h3>
        <h3 class="watt-headline-2">
          {{ translations.createTransferAgreementProposal.parties.titleTo | transloco }}
        </h3>
        <p>
          {{ translations.createTransferAgreementProposal.parties.description | transloco }}
        </p>
      }

      <div style="display: flex; align-items: center;">
        <watt-text-field
          [label]="
            translations.createTransferAgreementProposal.parties.receiverTinLabel | transloco
          "
          [placeholder]="
            translations.createTransferAgreementProposal.parties.receiverTinPlaceholder | transloco
          "
          type="text"
          [formControl]="formControl"
          (keydown)="preventNonNumericInput($event)"
          data-testid="new-agreement-receiver-input"
          [autocompleteOptions]="filteredReceiversTin"
          (search)="search.emit($event)"
          (autocompleteOptionSelected)="onSelectedRecipient($event)"
          (autocompleteOptionDeselected)="selectedCompanyName.set(undefined)"
          [autocompleteMatcherFn]="isRecipientMatchingOption"
          [maxLength]="8"
          #recipientInput
        >
          @if (!form.controls.receiverTin.errors && mode === 'create') {
            <watt-field-hint
              [innerHTML]="
                translations.createTransferAgreementProposal.parties.receiverTinGeneralError
                  | transloco
              "
            />
          }

          @if (form.controls.receiverTin.errors?.['receiverTinEqualsSenderTin']) {
            <watt-field-error
              [innerHTML]="
                translations.createTransferAgreementProposal.parties.receiverTinEqualsSenderTin
                  | transloco
              "
            />
          }

          @if (form.controls.receiverTin.errors?.['pattern']) {
            <watt-field-error
              [innerHTML]="
                translations.createTransferAgreementProposal.parties.tinFormatError | transloco
              "
            />
          }

          @if (selectedCompanyName()) {
            <div class="descriptor">{{ selectedCompanyName() }}</div>
          }
        </watt-text-field>
      </div>
    </div>
  `,
})
export class ReceiverInputComponent {
  protected readonly translations = translations;

  @Input() mode: FormMode = 'create';
  @Input() formControl: FormControl = new FormControl();
  @Input() filteredReceiversTin = [''];

  @Output() search = new EventEmitter<string>();
  @Output() search = new EventEmitter<string>();

  protected preventNonNumericInput(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Control', 'Alt'];
    const selectAll = event.key === 'a' && (event.metaKey || event.ctrlKey);
    const isNumericInput = /^[0-9]+$/.test(event.key);
    const isSpecialKey = allowedKeys.includes(event.key);

    if (!isNumericInput && !isSpecialKey && !selectAll) {
      event.preventDefault();
    }
  }

  onSelectedRecipient(value: string) {
    const [tin, companyName] = value.split(' - ');
    this.selectedCompanyName.set(companyName);
    this.formControl.setValue(tin);
  }
}
