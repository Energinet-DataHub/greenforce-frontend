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

/**
 * Needed because `@testing-library/user-event` removed `keyCode` property on keyboard events
 * in v14.0.0-alpha.11 (https://github.com/testing-library/user-event/releases/tag/v14.0.0-alpha.11)
 *
 * Unfortunately `keyCode` is still widely used in Angular Material (https://github.com/search?q=repo%3Aangular%2Fcomponents%20.keyCode&type=code) so the removed `keyCode` property from `@testing-library/user-event` means that many tests are broken, specifically those using `type` and `keyboard` methods.
 *
 * The following workaround is taken from https://github.com/testing-library/user-event/issues/1065#issuecomment-1317562232
 *
 * The reason for having `{ capture }` as a param is because some tests work with `{ capture: true }`,
 * while others work with `{ capture: false }`. At the time of writing, there's no good way to figure out
 * when to use which, so the solution for now is trial and error.
 */
export function patchUserEventKeyCode(options: { capture: boolean }) {
  const keyCodes: Record<string, number> = {
    Tab: 9,
    Enter: 13,
    Escape: 27,
    ArrowLeft: 37,
    ArrowRight: 39,
  };

  function patchKeyCode(event: KeyboardEvent) {
    Object.defineProperty(event, 'keyCode', {
      get: () => keyCodes[event.code] ?? event.key.charCodeAt(0),
    });
  }

  document.addEventListener('keydown', patchKeyCode, options);
}
