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
import { Component, inject } from '@angular/core';
import { DhPermissionsTableComponent } from './table.component';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'dh-permissions-page',
  imports: [RouterOutlet, DhPermissionsTableComponent],
  template: `
    <dh-permissions-table (open)="navigate($event.id)" />
    <router-outlet />
  `,
  providers: [DhNavigationService],
})
export class DhPermissionsPageComponent {
  private nagationService = inject(DhNavigationService);

  navigate(id: string | number) {
    this.nagationService.navigate('details', id);
  }
}
