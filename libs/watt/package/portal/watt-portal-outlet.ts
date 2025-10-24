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
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  ViewContainerRef,
} from '@angular/core';
import { WattPortalService } from './watt-portal-service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'watt-portal-outlet',
  template: ``,
})
export class WattPortalOutlet {
  private portalService = inject(WattPortalService);
  private viewContainerRef = inject(ViewContainerRef);
  readonly name = input.required<string>();
  protected registrationEffect = effect((onCleanup) => {
    this.portalService.registerOutlet(this.name(), this.viewContainerRef);
    onCleanup(() => this.portalService.unregisterOutlet(this.name()));
  });
}
