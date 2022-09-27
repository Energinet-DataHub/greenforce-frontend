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
  NgModule,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { PermissionService } from './permission-service';
import { Permission } from './permissions';

@Directive({ selector: '[dhHasPermission]' })
export class DhHasPermissionDirective implements OnInit, OnDestroy {
  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  private subscription: Subscription | undefined;

  @Input() dhHasPermission?: Permissions[];

  ngOnInit(): void {
    this.subscription = this.permissionService
      .hasPermission(this.dhHasPermission![0])
      .pipe(tap((x) => this.updateView(x)))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
  }

  private updateView(hasPermission: boolean) {
    console.log(this.dhHasPermission, ' with ', hasPermission);
    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}

@NgModule({
  declarations: [DhHasPermissionDirective],
  exports: [DhHasPermissionDirective],
})
export class DhHasPermissionDirectiveModule {}
