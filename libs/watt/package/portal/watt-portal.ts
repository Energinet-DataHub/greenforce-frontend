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
import { Component, effect, inject, input, TemplateRef, viewChild } from '@angular/core';
import { WattPortalService } from './watt-portal-service';

@Component({
  selector: 'watt-portal',
  template: `<ng-template><ng-content /></ng-template>`,
})
export class WattPortal {
  private portalService = inject(WattPortalService);
  private templateRef = viewChild.required(TemplateRef);
  readonly to = input.required<string>();
  protected attachmentEffect = effect((onCleanup) => {
    this.portalService.attachTemplate(this.to(), this.templateRef());
    onCleanup(() => this.portalService.detachTemplate(this.to()));
  });
}
