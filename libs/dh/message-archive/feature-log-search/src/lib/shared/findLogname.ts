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
const regexLogNameWithDateFolder = new RegExp(/\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\/.*/);
const regexLogNameIsSingleGuid = new RegExp(/[\da-zA-Z]{8}-([\da-zA-Z]{4}-){3}[\da-zA-Z]{12}$/);

export function findLogName(logUrl: string): string {
  if (regexLogNameWithDateFolder.test(logUrl)) {
    const match = regexLogNameWithDateFolder.exec(logUrl);
    return match != null ? match[0] : '';
  } else if (regexLogNameIsSingleGuid.test(logUrl)) {
    const match = regexLogNameIsSingleGuid.exec(logUrl);
    return match != null ? match[0] : '';
  }

  return '';
}
