/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
 * Should be kept in sync with ./_breakpoints.scss
 * NOTE: 
 * We don't use CSS Custom Properties for our breakpoints,
 * because they can't be used in media queries and we don't wan't those changed on the fly
 */
export enum WattBreakpoints {
  XSmall = '(max-width: 599.98px)',
  Small = '(min-width: 600px) and (max-width: 959.98px)',
  Medium = '(min-width: 960px) and (max-width: 1279.98px)',
  Large = '(min-width: 1280px) and (max-width: 1919.98px)',
  XLarge = '(min-width: 1920px)',
}