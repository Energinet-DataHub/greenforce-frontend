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
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { PermissionService } from './permission.service';
import { Permission } from './permission';
import { concatAll, from, map, reduce, take } from 'rxjs';

@Directive({ standalone: true, selector: '[dhPermissionRequired]' })
export class DhPermissionRequiredDirective implements OnInit {
  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainerRef: ViewContainerRef,
    private permissionService: PermissionService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  @Input() dhPermissionRequired: Permission[] = [];

  ngOnInit(): void {
    from(this.dhPermissionRequired)
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
  }
}
