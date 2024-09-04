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
import {
  ChangeDetectorRef,
  Directive,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  input,
} from '@angular/core';
import { concatAll, from, map, reduce, take } from 'rxjs';

import { Permission } from '@energinet-datahub/dh/shared/domain';

import { PermissionService } from './permission.service';

@Directive({
  standalone: true,
  selector: '[dhPermissionRequired]',
})
export class DhPermissionRequiredDirective {
  private templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
  private permissionService = inject(PermissionService);
  private changeDetectorRef = inject(ChangeDetectorRef);

  dhPermissionRequired = input<Permission[]>();

  constructor() {
    effect(
      () => {
        this.viewContainerRef.clear();
        from(this.dhPermissionRequired() ?? [])
          .pipe(
            map((permission) => this.permissionService.hasPermission(permission)),
            concatAll(),
            reduce((hasPermission, next) => hasPermission || next),
            take(1)
          )
          .subscribe((hasPermission) => {
            if (hasPermission) {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
              this.changeDetectorRef.detectChanges();
            }
          });
      },
      { allowSignalWrites: true }
    );
  }
}
