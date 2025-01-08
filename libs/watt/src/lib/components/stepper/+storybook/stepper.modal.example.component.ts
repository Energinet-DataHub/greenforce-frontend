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
import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { WATT_STEPPER } from '..';
import { WattButtonComponent } from '../../button';
import { WattModalComponent } from '../../modal/watt-modal.component';
import { StepperExampleComponent } from './stepper.example.component';

@Component({
  selector: 'watt-stepper-modal-example',
  templateUrl: './stepper.modal.example.component.html',
  imports: [
    WATT_STEPPER,
    ReactiveFormsModule,
    WattButtonComponent,
    WattModalComponent,
    StepperExampleComponent,
    MatButtonModule,
  ],
})
export class StepperModalExampleComponent {
  formBuilder = inject(FormBuilder);
  user = this.formBuilder.group({
    firstname: ['', Validators.required],
    lastname: [''],
  });
  address = this.formBuilder.group({ street: [''], city: [''] });
  email = this.formBuilder.group({ email: [''] });
  @ViewChild('modal')
  modal!: TemplateRef<Element>;

  complete(): void {
    console.log('completed');
  }
}
