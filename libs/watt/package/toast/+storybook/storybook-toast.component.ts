//#region License
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
//#endregion
import { Component, inject, input } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { WattButtonComponent } from '../../button';
import { WattToastService } from '../watt-toast.service';
import { WattToastConfig } from '../watt-toast.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-toast',
  template: `
    <h1>Toast</h1>

    <watt-button (click)="open()" variant="secondary">Open toast</watt-button>
  `,
  imports: [WattButtonComponent],
  providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: {} }],
})
export class StorybookToastComponent {
  private toast = inject(WattToastService);

  config = input.required<WattToastConfig>();

  open() {
    this.toast.open(this.config());

    if (this.config().type === 'loading') {
      setTimeout(() => {
        this.toast.update({ message: 'Finished loading :-)', type: 'success' });
      }, 1000);
    }
  }
}
