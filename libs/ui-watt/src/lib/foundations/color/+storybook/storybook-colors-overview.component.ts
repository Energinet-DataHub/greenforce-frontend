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
import { Component } from '@angular/core';

import { WattColorHelperService } from '../color-helper.service';
import { WattColors } from '../colors';

interface ColorType {
  name: string;
  title: string;
  description?: string;
  colors: Color[];
}

interface Color {
  name: string;
  var: string;
  color: string;
  contrast: string;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-colors-overview',
  templateUrl: './storybook-colors-overview.component.html',
  styleUrls: ['./storybook-colors-overview.component.scss'],
})
export class StorybookColorsOverviewComponent {
  /**
   * @ignore
   */
  colorTypes: ColorType[] = [
    {
      name: 'primary',
      title: 'Primary Colors',
      description:
        'The primary colors are the brand colors that are main colors used on central elements like primary buttons and in the main navigation.',
      colors: [
        this.getColor('primary', WattColors.primary),
        this.getColor('primary-dark', WattColors.primaryDark),
      ],
    },
    {
      name: 'focus',
      title: 'Focus Colors',
      colors: [
        this.getColor('focus', WattColors.focus),
        this.getColor('selection', WattColors.selection),
      ],
    },
    {
      name: 'neutral',
      title: 'Neutral Colors',
      colors: [
        this.getColor('black', WattColors.black),
        this.getColor('white', WattColors.white),
        this.getColor('grey-50', WattColors.grey50),
        this.getColor('grey-100', WattColors.grey100),
        this.getColor('grey-200', WattColors.grey200),
        this.getColor('grey-300', WattColors.grey300),
        this.getColor('grey-400', WattColors.grey400),
        this.getColor('grey-500', WattColors.grey500),
        this.getColor('grey-600', WattColors.grey600),
        this.getColor('grey-700', WattColors.grey700),
        this.getColor('grey-800', WattColors.grey800),
        this.getColor('grey-900', WattColors.grey900),
      ],
    },
    {
      name: 'state',
      title: 'State Colors',
      description:
        'State color helps users find people, identify status, see actions, locate help, and understand next steps. The consistent use of color keeps cognitive load low and makes for a unified and engaging user experience.',
      colors: [
        this.getColor('danger', WattColors.danger),
        this.getColor('warning', WattColors.warning),
        this.getColor('success', WattColors.success),
        this.getColor('info', WattColors.info),
        this.getColor('danger-light', WattColors.dangerLight),
        this.getColor('warning-light', WattColors.warningLight),
        this.getColor('success-light', WattColors.successLight),
        this.getColor('info-light', WattColors.infoLight),
      ],
    },
  ];

  constructor(private colorHelperService: WattColorHelperService) {}

  /**
   * @ignore
   */
  copyToClipboard(color: string) {
    `var(${navigator.clipboard.writeText(color)})`;
  }

  /**
   * @ignore
   */
  private getColor(name: string, color: WattColors) {
    return {
      name,
      var: color,
      color: this.colorHelperService.getColor(color),
      contrast: this.colorHelperService.getColorContrast(color),
    };
  }
}
