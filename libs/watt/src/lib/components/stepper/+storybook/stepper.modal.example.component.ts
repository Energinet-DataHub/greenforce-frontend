import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { WATT_STEPPER } from '..';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { WattButtonComponent } from '../../button';
import { WattIconComponent } from '../../../foundations/icon';
import { WattTextFieldComponent } from '../../text-field/watt-text-field.component';
import { WattFieldErrorComponent } from '../../field/watt-field-error.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { WattModalComponent } from '../../modal/watt-modal.component';
import { StepperExampleComponent } from './stepper.example.component';

@Component({
  selector: 'watt-stepper-modal-example',
  standalone: true,
  templateUrl: './stepper.modal.example.component.html',
  imports: [
    WATT_STEPPER,
    ReactiveFormsModule,
    WattButtonComponent,
    WattIconComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    WattModalComponent,
    StepperExampleComponent,
    MatButtonModule,
    CommonModule,
  ],
})
export class StepperModalExampleComponent {
  formBuilder = inject(FormBuilder);
  user = this.formBuilder.group({
    firstname: ['', Validators.required],
    lastname: [''],
  });
  address = new FormBuilder().group({ street: [''], city: [''] });
  email = new FormBuilder().group({ email: [''] });
  @ViewChild('modal')
  modal!: TemplateRef<Element>;

  complete(): void {
    console.log('completed');
  }
}
