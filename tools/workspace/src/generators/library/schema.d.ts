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

export enum LibraryType {
  configuration = 'configuration',
  dataAccess = 'data-access',
  domain = 'domain',
  e2eUtil = 'e2e-util',
  environments = 'environments',
  feature = 'feature',
  testUtil = 'test-util',
  shell = 'shell',
  ui = 'ui',
  util = 'util',
}

export interface GenerateLibrarySchema {
  domain: string;
  libraryType: LibraryType;
  name?: string;
  product: string;
}
