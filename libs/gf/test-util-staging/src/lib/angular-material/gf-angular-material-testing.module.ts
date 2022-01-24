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
import { NgModule } from '@angular/core';
import { MATERIAL_SANITY_CHECKS, SanityChecks } from '@angular/material/core';
import { MatIconTestingModule } from '@angular/material/icon/testing';

const disableThemeCheck: SanityChecks = {
  doctype: true,
  /**
   * `getComputedStyle` does not work with Jest so this check will fail.
   */
  theme: false,
  version: true,
};

/**
 * Disable theme check because it always fails in Jest tests.
 *
 * Fake the icon registry to enable verification of SVG icons.
 */
@NgModule({
  imports: [MatIconTestingModule],
  providers: [
    {
      provide: MATERIAL_SANITY_CHECKS,
      useValue: disableThemeCheck,
    },
  ],
})
export class GfAngularMaterialTestingModule {}
