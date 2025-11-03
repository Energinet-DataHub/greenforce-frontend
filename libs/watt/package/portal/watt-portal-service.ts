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
import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WattPortalService {
  private portalOutletMap = new Map<string, ViewContainerRef>();

  registerOutlet = (name: string, viewContainerRef: ViewContainerRef) => {
    this.portalOutletMap.set(name, viewContainerRef);
  };

  unregisterOutlet = (name: string) => {
    this.portalOutletMap.delete(name);
  };

  attachTemplate = (name: string, templateRef: TemplateRef<unknown>) => {
    this.portalOutletMap.get(name)?.createEmbeddedView(templateRef);
  };

  detachTemplate = (name: string) => this.portalOutletMap.get(name)?.detach();
}
