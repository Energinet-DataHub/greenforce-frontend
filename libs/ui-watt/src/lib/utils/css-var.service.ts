/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WattCSSVarService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private window: Window
  ) {}

  public getVar(name: string): string {
    return this.getComputedStyle().getPropertyValue(name);
  }

  private getComputedStyle() {
    return this.window.getComputedStyle(this.document.documentElement);
  }
}
