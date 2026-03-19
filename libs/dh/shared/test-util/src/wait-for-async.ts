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
import { TestBed } from '@angular/core/testing';

/**
 * Polls an assertion until it passes, flushing Angular signals/effects
 * between each attempt via `TestBed.tick()`.
 *
 * This is a drop-in replacement for Testing Library's `waitFor` that does
 * NOT rely on `MutationObserver`, making it compatible with happy-dom
 * (whose `MutationObserver` implementation does not work correctly with
 * Angular change detection).
 */
export async function waitForAsync(
  assertion: () => void | Promise<void>,
  { timeout = 3000, interval = 50 } = {}
): Promise<void> {
  const start = Date.now();

  for (;;) {
    TestBed.tick();

    try {
      await assertion();
      return;
    } catch (error) {
      if (Date.now() - start >= timeout) throw error;
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
}
