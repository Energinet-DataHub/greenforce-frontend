//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
import { Component, output, input, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  GetOrganizationByIdDocument,
  GetOrganizationsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet/watt/dropdown';
import { VaterStackComponent } from '@energinet/watt/vater';
import { DhOrganizationDetails } from '@energinet-datahub/dh/market-participant/domain';
import { lazyQuery, query } from '@energinet-datahub/dh/shared/util-apollo';

@Component({
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    WattDropdownComponent,
    WattButtonComponent,
    VaterStackComponent,
  ],
  selector: 'dh-choose-organization-step',
  styles: [
    `
      :host {
        display: block;
      }

      watt-dropdown {
        width: 50%;
      }
    `,
  ],
  template: `<vater-stack
    align="start"
    fill="horizontal"
    *transloco="let t; prefix: 'marketParticipant.actor.create'"
  >
    <watt-dropdown
      [showResetOption]="false"
      [options]="organizationOptions()"
      [label]="t('organization')"
      (ngModelChange)="onOrganizationChange($event)"
      [formControl]="chooseOrganizationForm().controls.orgId"
    />
    <watt-button variant="text" icon="plus" (click)="toggleShowCreateNewOrganization.emit()">{{
      t('newOrganization')
    }}</watt-button>
  </vater-stack>`,
})
export class DhChooseOrganizationStepComponent {
  private getOrganizationsQuery = query(GetOrganizationsDocument);
  private getOrganizationByIdQuery = lazyQuery(GetOrganizationByIdDocument);

  organizationOptions = computed<WattDropdownOptions>(() => {
    const organizations = this.getOrganizationsQuery.data()?.organizations ?? [];

    return organizations.map((org) => ({
      value: org.id ?? '',
      displayValue: org.name,
    }));
  });

  chooseOrganizationForm = input.required<
    FormGroup<{
      orgId: FormControl<string | null>;
    }>
  >();

  toggleShowCreateNewOrganization = output<void>();
  selectOrganization = output<DhOrganizationDetails>();

  async onOrganizationChange(id: string) {
    const organization = (await this.getOrganizationByIdQuery.query({ variables: { id } })).data
      .organizationById;

    if (organization) {
      this.selectOrganization.emit(organization);
    }
  }
}
