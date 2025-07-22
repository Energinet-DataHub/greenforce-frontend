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
import * as ettLocalApiEnvironment from './assets/configuration/ett-api-environment.local.json';
import * as ettLocalB2cEnvironment from './assets/configuration/ett-azure-b2c-settings.json';
import graphLoader from './assets/graph-loader.json';
import sustainableChart from './assets/landing-page/sustainable-chart.json';
import naming from './assets/landing-page/EnergyTT-dk-logo.json';

// HINT: Change apiBase here, for testing preview branches locally
export { ettLocalApiEnvironment };
export { ettLocalB2cEnvironment };
export { graphLoader };
export { sustainableChart };
export { naming };
