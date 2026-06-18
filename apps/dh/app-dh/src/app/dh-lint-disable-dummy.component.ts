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
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  // Intentionally violates the app's `dh-` selector convention to verify lint suppressions.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'lint-disable-dummy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>Dummy component used only for lint suppression checks.</p>`,
})
export class DhLintDisableDummyComponent {
  // Intentionally uses `any` to verify rule-specific disable comments still work.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected readonly unsafeValue: any = { reason: 'eslint v10 suppression smoke test' };

  protected runLintSuppressionSmokeTest(): void {
    // Intentionally unused to verify warnings can still be suppressed.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const intentionallyUnused = this.unsafeValue;
  }

  // Intentionally empty to verify rule-specific disable comments still work.
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected intentionallyEmpty(): void {}
}
