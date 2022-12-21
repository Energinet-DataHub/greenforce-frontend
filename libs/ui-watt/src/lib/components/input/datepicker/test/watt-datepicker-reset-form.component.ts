import { Component } from '@angular/core';
import { WattButtonModule } from '../../../button';
import { WattDatepickerModule, WattRange } from '../';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

const buildForm = () => {
  return new FormGroup({
    dateRange: new FormControl<WattRange>({
      start: '',
      end: '',
    }),
  });
};

@Component({
  standalone: true,
  templateUrl: './watt-datepicker-reset-form.component.html',
  selector: 'watt-datepicker-reset-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    WattDatepickerModule,
    WattButtonModule,
  ],
})
export class WattDatepickerResetFormComponent {
  formGroup: FormGroup = buildForm();
  resetForm() {
    this.formGroup = buildForm();
  }
}
