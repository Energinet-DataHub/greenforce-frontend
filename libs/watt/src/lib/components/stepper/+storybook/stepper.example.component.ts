import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { WATT_STEPPER } from '..';
import { WattButtonComponent } from '../../button';
import { WattIconComponent } from '../../../foundations/icon';
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
