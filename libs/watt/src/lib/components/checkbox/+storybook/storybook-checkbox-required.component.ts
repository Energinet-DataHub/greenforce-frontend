import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { WattCheckboxComponent } from '../watt-checkbox.component';
import { WattButtonComponent } from '../../button/watt-button.component';

@Component({
  selector: 'watt-storybook-checkbox-required',
  standalone: true,
  imports: [ReactiveFormsModule, WattCheckboxComponent, WattButtonComponent],
  template: `
    <form [formGroup]="form">
      <watt-checkbox formControlName="checkbox">Approve this</watt-checkbox>
      <watt-button variant="primary" type="submit">Submit</watt-button>
    </form>
  `,
  styles: [],
})
export class StoryBookCheckboxRequiredComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  form!: FormGroup;

  ngOnInit() {
    this.form = this.formBuilder.group({
      checkbox: [null, [Validators.requiredTrue]],
    });
  }
}
