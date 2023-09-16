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
import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { DhCalculationsCreateComponent } from './create/create.component';
import { DhCalculationsDetailsComponent } from './details/details.component';
import { DhCalculationsTableComponent } from './table/table.component';

@Component({
  selector: 'dh-calculations',
  standalone: true,
  imports: [
    DhCalculationsCreateComponent,
    DhCalculationsDetailsComponent,
    DhCalculationsTableComponent,
  ],
  template: `
    <dh-calculations-create #modal />
    <dh-calculations-details [id]="id()" (closed)="navigate(null)" />
    <dh-calculations-table
      [id]="id()"
      (selectedRow)="navigate($event.id)"
      (create)="modal.open()"
    />
  `,
})
export class DhCalculationsComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild(DhCalculationsDetailsComponent)
  details!: DhCalculationsDetailsComponent;

  id = toSignal<string>(this.route.queryParams.pipe(map((p) => p.id ?? undefined)));

  navigate(id: string | null) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id },
    });
  }
}
