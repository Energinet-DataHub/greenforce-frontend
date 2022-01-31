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
import { Component, NgModule } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { WattCheckboxModule } from '../watt-checkbox.module';
import { WattButtonModule } from '../../button';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-checkbox-wrapper',
  templateUrl: './storybook-checkbox-wrapper.component.html',
})
export class StorybookCheckboxWrapperComponent {
  /**
   * @ignore
   */
  exampleFormControl = new FormControl({
    value: true,
    disabled: false,
  });

  /**
   * @ignore
   */
  disableControl() {
    const isEnabled = this.exampleFormControl.enabled;

    if (isEnabled) {
      this.exampleFormControl.disable();
    } else {
      this.exampleFormControl.enable();
    }
  }
}

@NgModule({
  declarations: [StorybookCheckboxWrapperComponent],
  exports: [StorybookCheckboxWrapperComponent],
  imports: [WattCheckboxModule, WattButtonModule, ReactiveFormsModule],
})
export class StorybookCheckboxWrapperScam {}
