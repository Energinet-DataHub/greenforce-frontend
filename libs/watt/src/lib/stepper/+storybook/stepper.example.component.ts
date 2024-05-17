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
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { WATT_STEPPER } from '..';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattTextFieldComponent } from '../../text-field/watt-text-field.component';
import { WattFieldErrorComponent } from '../../field/watt-field-error.component';

@Component({
  selector: 'watt-stepper-example',
  standalone: true,
  templateUrl: './stepper.example.component.html',
  styles: [
    `
      form {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: var(--watt-space-m);
      }
    `,
  ],
  imports: [
    WATT_STEPPER,
    ReactiveFormsModule,
    WattButtonComponent,
    WattIconComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    MatButtonModule,
  ],
})
export class StepperExampleComponent {
  formBuilder = inject(FormBuilder);
  user = this.formBuilder.group({
    firstname: ['', Validators.required],
    lastname: [''],
  });
  address = new FormBuilder().group({ street: [''], city: [''] });
  email = new FormBuilder().group({ email: [''] });

  complete(): void {
    console.log('completed');
  }
}
