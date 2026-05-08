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

/**
 * URL redaction patterns for the DataHub application. Each entry
 * is a regex string whose first capture group marks the sensitive
 * segment to replace with `~`. URLs that don't match any pattern
 * are shown as-is (default-show).
 */
export const dhRedactionPatterns = [
  '/admin/users/details/([^/?#]+)',
  '/metering-point/(\\d+|[a-zA-Z0-9]{10,})',
];
