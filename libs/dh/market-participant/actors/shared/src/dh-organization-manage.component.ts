import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { TranslocoDirective } from '@ngneat/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattActionChipComponent } from '@energinet-datahub/watt/chip';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

import { dhDomainValidator } from '@energinet-datahub/dh/shared/ui-validators';

@Component({
  standalone: true,
  selector: 'dh-organization-manage',
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WattTextFieldComponent,
    WattButtonComponent,
    WattFieldErrorComponent,
    WattActionChipComponent,

    VaterStackComponent,
    VaterFlexComponent,
  ],
  template: `
    <ng-container *transloco="let t; read: 'marketParticipant.actor.create'">
      <vater-stack direction="row" gap="m" fill="horizontal">
        <watt-text-field [prefix]="'alternateEmail'" [formControl]="domain" [label]="t('domain')">
          @if (domain.hasError('pattern')) {
            <watt-field-error>
              {{ t('domainInvalid') }}
            </watt-field-error>
          }
        </watt-text-field>
        <watt-button variant="text" (click)="addDomain()">{{ t('add') }}</watt-button>
      </vater-stack>
      <vater-flex wrap="wrap" direction="row" grow="0" gap="s" justify="flex-start">
        @for (domain of domains().value; track domain) {
          <watt-action-chip icon="remove" (onClick)="removeDomain(domain)">{{
            domain
          }}</watt-action-chip>
        }
      </vater-flex>
      @if (domains().touched || domains().hasError('required')) {
        <watt-field-error>
          {{ t('minimumOneDomain') }}
        </watt-field-error>
      }
    </ng-container>
  `,
})
export class DhOrganizationManageComponent {
  domain = new FormControl('', {
    nonNullable: true,
    validators: [dhDomainValidator],
  });
  domains = input.required<FormControl<string[]>>();

  addDomain() {
    if (this.domain.invalid) return;

    this.domains().patchValue([...this.domains().value, this.domain.value]);
    this.domain.reset();
  }

  removeDomain(domain: string) {
    this.domains().patchValue(this.domains().value.filter((d) => d !== domain));
  }
}
