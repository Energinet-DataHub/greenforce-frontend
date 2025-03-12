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
import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { timer } from 'rxjs';

import { WATT_CARD } from '../../card';

@Component({
  selector: 'watt-storybook-drawer-content',
  template: `
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda perspiciatis officia
      quam recusandae, voluptate ratione pariatur temporibus, consequuntur deserunt numquam dolorum!
      Sequi assumenda amet, laboriosam omnis ex sapiente voluptatibus?
    </p>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda perspiciatis officia
      quam recusandae, voluptate ratione pariatur temporibus, consequuntur deserunt numquam dolorum!
      Sequi assumenda amet, laboriosam omnis ex sapiente voluptatibus?
    </p>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda perspiciatis officia
      quam recusandae, voluptate ratione pariatur temporibus, consequuntur deserunt numquam dolorum!
      Sequi assumenda amet, laboriosam omnis ex sapiente voluptatibus?
    </p>
    <watt-card>
      <watt-card-title
        ><h3>Drawer has been opened for: {{ timer$ | async }}s</h3></watt-card-title
      >
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda perspiciatis
        officia quam recusandae, voluptate ratione pariatur temporibus, consequuntur deserunt
        numquam dolorum! Sequi assumenda amet, laboriosam omnis ex sapiente voluptatibus?
      </p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda perspiciatis
        officia quam recusandae, voluptate ratione pariatur temporibus, consequuntur deserunt
        numquam dolorum! Sequi assumenda amet, laboriosam omnis ex sapiente voluptatibus?
      </p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda perspiciatis
        officia quam recusandae, voluptate ratione pariatur temporibus, consequuntur deserunt
        numquam dolorum! Sequi assumenda amet, laboriosam omnis ex sapiente voluptatibus?
      </p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda perspiciatis
        officia quam recusandae, voluptate ratione pariatur temporibus, consequuntur deserunt
        numquam dolorum! Sequi assumenda amet, laboriosam omnis ex sapiente voluptatibus?
      </p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda perspiciatis
        officia quam recusandae, voluptate ratione pariatur temporibus, consequuntur deserunt
        numquam dolorum! Sequi assumenda amet, laboriosam omnis ex sapiente voluptatibus?
      </p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda perspiciatis
        officia quam recusandae, voluptate ratione pariatur temporibus, consequuntur deserunt
        numquam dolorum! Sequi assumenda amet, laboriosam omnis ex sapiente voluptatibus?
      </p>
    </watt-card>
  `,
  imports: [AsyncPipe, WATT_CARD],
})
export class WattStorybookDrawerContentComponent {
  timer$ = timer(0, 1000);
}
