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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { WattButtonModule } from '../button';
import { WattDrawerComponent } from './watt-drawer.component';
import { WattDrawerModule } from './watt-drawer.module';

export default {
  title: 'Components/Drawer',
  component: WattDrawerComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, WattButtonModule, WattDrawerModule],
    }),
  ],
} as Meta<WattDrawerComponent>;

export const Overview: Story<WattDrawerComponent> = (args) => ({
  props: args,
  template: `
    <watt-drawer #drawer>
      <ng-template wattDrawerContent>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla
          assumenda perspiciatis officia quam recusandae, voluptate ratione
          pariatur temporibus, consequuntur deserunt numquam dolorum! Sequi
          assumenda amet, laboriosam omnis ex sapiente voluptatibus?
        </p>
      </ng-template>
    </watt-drawer>

    <watt-button (click)="drawer.open()">Open drawer</watt-button>
    <br /><br />
    <watt-button (click)="drawer.close()">Close drawer</watt-button>
  `,
});

Overview.args = {};
