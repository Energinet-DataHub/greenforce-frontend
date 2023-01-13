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
import { Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { DhCreateUserroleTabsComponent } from './tabs/dh-create-userrole-tabs.component';

@Component({
  selector: 'dh-admin-create-userrole',
  standalone: true,
  template: `<dh-create-userrole-tabs></dh-create-userrole-tabs>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [TranslocoModule, DhCreateUserroleTabsComponent],
})
export class DhAdminCreateUserRoleComponent {}
