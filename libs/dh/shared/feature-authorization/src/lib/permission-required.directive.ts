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
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { PermissionService } from './permission.service';
import { Permission } from './permission';
import { concatAll, from, map, reduce, Subject, takeUntil } from 'rxjs';

@Directive({ standalone: true, selector: '[dhPermissionRequired]' })
export class DhPermissionRequiredDirective implements OnInit, OnDestroy {
  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  private destroy$ = new Subject<void>();

  @Input() dhPermissionRequired: Permission[] = [];

  ngOnInit(): void {
    from(this.dhPermissionRequired)
      .pipe(
        map((permission) => this.permissionService.hasPermission(permission)),
        concatAll(),
        reduce((hasPermission, next) => hasPermission || next)
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasPermission) => {
        if (hasPermission) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
