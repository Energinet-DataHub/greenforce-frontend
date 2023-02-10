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

import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  WattModalComponent,
  WattModalModule,
} from '@energinet-datahub/watt/modal';

import { CommonModule } from '@angular/common';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { TranslocoModule } from '@ngneat/transloco';
import { MatDividerModule } from '@angular/material/divider';
import { WattIconModule } from '@energinet-datahub/watt/icon';
import { WattInputModule } from '@energinet-datahub/watt/input';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  WattStepperButtonNextDirective,
  WattStepperButtonPreviousDirective,
} from '@energinet-datahub/watt/stepper';
import { MatInputModule } from '@angular/material/input';
import {
  StepperSelectionEvent,
  STEPPER_GLOBAL_OPTIONS,
} from '@angular/cdk/stepper';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
@Component({
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  selector: 'dh-invite-user-modal',
  templateUrl: './dh-invite-user-modal.component.html',
  styleUrls: ['./dh-invite-user-modal.component.scss'],
  standalone: true,
  imports: [
    WattModalModule,
    MatStepperModule,
    WattButtonModule,
    WattStepperButtonNextDirective,
    WattStepperButtonPreviousDirective,
    TranslocoModule,
    MatDividerModule,
    WattIconModule,
    CommonModule,
    ReactiveFormsModule,
    WattInputModule,
    WattFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class DhInviteUserModalComponent implements AfterViewInit {
  private readonly formBuilder = inject(FormBuilder);
  @ViewChild('inviteUserModal') inviteUserModal!: WattModalComponent;
  @ViewChild('stepper') stepper!: MatStepper;
  @Output() closed = new EventEmitter<void>();
  userInfo = this.formBuilder.group({
    name: ['', Validators.required],
  });
  userRoles = this.formBuilder.group({
    userRole: ['', Validators.required],
  });

  ngAfterViewInit(): void {
    this.inviteUserModal.open();
  }

  inviteUser() {
    if (this.userInfo.valid && this.userRoles.valid) {
      this.inviteUserModal.close(true);
    } else {
      this.userRoles.markAllAsTouched();
    }
  }

  closeModal(status: boolean) {
    this.closed.emit();
    this.inviteUserModal.close(status);
  }
}
