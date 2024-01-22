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
import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EovOverviewStore } from '@energinet-datahub/eov/overview/data-access-api';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_DIALOG_DATA, WattModalActionsComponent, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'eov-eov-overview-ui-masterdata-dialog',
  standalone: true,
  imports: [
    CommonModule,
    WattModalComponent,
    WattModalActionsComponent,
    WattButtonComponent,
    WattTextFieldComponent,
    ReactiveFormsModule,
    TranslocoModule
  ],
  templateUrl: './eov-overview-ui-masterdata-edit-alias-dialog.component.html',
  styleUrl: './eov-overview-ui-masterdata-edit-alias-dialog.component.scss',
})
export class EovOverviewUiMasterdataAliasEditDialogComponent {
  private readonly formBuilder = inject(FormBuilder);
  private store = inject(EovOverviewStore);
  private meteringPointId = inject(WATT_DIALOG_DATA).meteringPointId;
  private currentAlias = inject(WATT_DIALOG_DATA).currentAlias;
  @ViewChild(WattModalComponent)
  private modal!: WattModalComponent;
  readonly editAliasForm = this.formBuilder.group({
    alias: this.formBuilder.nonNullable.control(this.currentAlias, [
      Validators.required,
    ]),
  });

  closeModal(): void {
    this.modal.close(false);
  }

  save() {
    if (!this.editAliasForm.valid) {
      return;
    }
    this.store.saveAlias({
      meteringPointId: this.meteringPointId,
      alias: this.editAliasForm.controls.alias.value,
      onSuccessFn: () => this.modal.close(true),
      onErrorFn: () => console.log("ups")
    });
  }
}
