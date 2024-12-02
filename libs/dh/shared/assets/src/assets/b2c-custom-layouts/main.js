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
const Utils = {
  showContent: function () {
    Utils.waitFor('main', (main) => {
      main.style.display = 'block';

      const element = document.getElementById('otpCode');
      if (element) {
        const previousSibling = element.previousElementSibling;
        const parent = element.parentElement;

        if (previousSibling) {
          parent.insertBefore(element, previousSibling);
        }
      }
    });
  },
  waitFor: function (selector, callback) {
    const elm = document.querySelector(selector);

    if (elm) {
      callback(elm);
    } else {
      setTimeout(function () {
        Utils.waitFor(selector, callback);
      }, 100);
    }
  },
  toggleErrorClasses: function () {
    document.querySelectorAll('input').forEach((inputElement) => {
      const parent = inputElement.parentElement;
      const errorElement = inputElement.previousElementSibling;
      const hasError =
        inputElement.classList.contains('highlightError') ||
        errorElement.classList.contains('show');
      if (!parent) return;

      if (hasError) {
        parent.classList.add('entry-item-error');
      } else {
        parent.classList.remove('entry-item-error');
      }
    });
  },
};
