import { Component, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WattFormFieldModule } from '../../../form-field/form-field.module';
import { WattChipDatepickerComponent } from '../watt-chip-datepicker.component';
import { CommonModule } from '@angular/common';
import { WattRangeValidators } from '../../shared/validators';

@Component({
  selector: 'watt-chip-datepicker-example',
  templateUrl: './watt-chip-datepicker.example.component.html',
  styleUrls: ['./watt-chip-datepicker.example.component.scss'],
  standalone: true,
  imports: [WattFormFieldModule, ReactiveFormsModule, WattChipDatepickerComponent, CommonModule],
})
export class ChipDatepickerExampleComponent {
  @Input() withValidations = false;
  exampleFormControlSingle = new FormBuilder().control(
    null,
    this.withValidations ? Validators.required : null
  );
  exampleFormControlRange = new FormBuilder().control(
    null,
    this.withValidations ? WattRangeValidators.required() : null
  );
}
