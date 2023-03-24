import { Component } from '@angular/core';
import { WATT_STEPPER } from '..';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { WattInputModule } from '../../input';
import { WattFormFieldModule } from '../../form-field';
import { WattButtonModule } from '../../button';
import { WattIconModule } from '../../../foundations/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'watt-stepper-example',
  standalone: true,
  templateUrl: './stepper.example.component.html',
  imports: [
    WATT_STEPPER,
    WattInputModule,
    ReactiveFormsModule,
    WattFormFieldModule,
    WattButtonModule,
    WattIconModule,
    MatButtonModule,
    CommonModule,
  ],
})
export class StepperExampleComponent {
  user = new FormBuilder().group({
    firstname: ['', Validators.required],
    lastname: [''],
  });
  address = new FormBuilder().group({ street: [''], city: [''] });
  email = new FormBuilder().group({ email: [''] });
}
