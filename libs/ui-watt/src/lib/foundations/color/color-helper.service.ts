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
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Colors } from './colors';

@Injectable({
  providedIn: 'root',
})
export class ColorHelperService {
  private colorContrastSuffix = 'contrast';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private window: Window
  ) {}

  public getColor(colorName: Colors): string {
    return this.getComputedStyle().getPropertyValue(colorName);
  }

  public getColorContrast(colorName: Colors): string {
    return this.getComputedStyle().getPropertyValue(
      `${colorName}-${this.colorContrastSuffix}`
    );
  }

  private getComputedStyle() {
    return this.window.getComputedStyle(this.document.documentElement);
  }
}
