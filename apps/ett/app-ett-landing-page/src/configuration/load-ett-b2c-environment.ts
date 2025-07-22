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
import {
  environment,
  EttB2cEnvironment,
  loadEttB2cEnvironment as _loadEttB2cEnvironment,
} from '@energinet-datahub/ett/shared/environments';

export function loadEttB2cEnvironment(): Promise<EttB2cEnvironment> {
  const configurationFilename = environment.production
    ? 'ett-azure-b2c-settings.json'
    : 'ett-azure-b2c-settings.local.json';

  return _loadEttB2cEnvironment(configurationFilename);
}
