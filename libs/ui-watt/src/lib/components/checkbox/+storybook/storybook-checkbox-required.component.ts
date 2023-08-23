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
