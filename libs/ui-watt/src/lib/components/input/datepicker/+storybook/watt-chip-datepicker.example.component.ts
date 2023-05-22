import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { WattFormFieldModule } from '../../../form-field/form-field.module';
import { WattChipDatepickerComponent } from '../watt-chip-datepicker.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'watt-chip-datepicker-example',
  templateUrl: './watt-chip-datepicker.example.component.html',
  styleUrls: ['./watt-chip-datepicker.example.component.scss'],
  standalone: true,
  imports: [WattFormFieldModule, ReactiveFormsModule, WattChipDatepickerComponent, CommonModule],
})
export class ChipDatepickerExampleComponent {
  @Input() withValidations = false;
  @Input() exampleFormControlSingle!: FormControl;
  @Input() exampleFormControlRange!: FormControl;
}
