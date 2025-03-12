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
export const WattColor = {
  // Primary
  primary: '--watt-color-primary' as const,
  primaryLight: '--watt-color-primary-light' as const,
  primaryDark: '--watt-color-primary-dark' as const,
  primaryDarker: '--watt-color-primary-darker' as const,
  primaryUltralight: '--watt-color-primary-ultralight' as const,
  // Secondary
  secondary: '--watt-color-secondary' as const,
  secondaryLight: '--watt-color-secondary-light' as const,
  secondaryDark: '--watt-color-secondary-dark' as const,
  secondaryUltralight: '--watt-color-secondary-ultralight' as const,
  // Data Visualization
  data1: '--watt-color-data-1' as const,
  data2: '--watt-color-data-2' as const,
  data3: '--watt-color-data-3' as const,
  // Neutrals
  black: '--watt-color-neutral-black' as const,
  white: '--watt-color-neutral-white' as const,
  grey50: '--watt-color-neutral-grey-50' as const,
  grey100: '--watt-color-neutral-grey-100' as const,
  grey200: '--watt-color-neutral-grey-200' as const,
  grey300: '--watt-color-neutral-grey-300' as const,
  grey400: '--watt-color-neutral-grey-400' as const,
  grey500: '--watt-color-neutral-grey-500' as const,
  grey600: '--watt-color-neutral-grey-600' as const,
  grey700: '--watt-color-neutral-grey-700' as const,
  grey800: '--watt-color-neutral-grey-800' as const,
  grey900: '--watt-color-neutral-grey-900' as const,
  // States
  danger: '--watt-color-state-danger' as const,
  dangerLight: '--watt-color-state-danger-light' as const,
  warning: '--watt-color-state-warning' as const,
  warningLight: '--watt-color-state-warning-light' as const,
  success: '--watt-color-state-success' as const,
  successLight: '--watt-color-state-success-light' as const,
  info: '--watt-color-state-info' as const,
  infoLight: '--watt-color-state-info-light' as const,
};

export type WattColorType = keyof typeof WattColor;
