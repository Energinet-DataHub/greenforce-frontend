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
import { Component } from '@angular/core';

import { WattColorHelperService } from '../color-helper.service';
import { WattColor } from '../colors';

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
        this.getColor('primary', WattColor.primary),
        this.getColor('primary-dark', WattColor.primaryDark),
        this.getColor('primary-light', WattColor.primaryLight),
        this.getColor('primary-back', WattColor.primaryBack),
      ],
    },
    {
      name: 'secondary',
      title: 'Secondary Colors',
      colors: [
        this.getColor('secondary', WattColor.secondary),
        this.getColor('secondary-dark', WattColor.secondaryDark),
        this.getColor('secondary-light', WattColor.secondaryLight),
        this.getColor('secondary-back', WattColor.secondaryBack),
      ],
    },
    {
      name: 'neutral',
      title: 'Neutral Colors',
      colors: [
        this.getColor('black', WattColor.black),
        this.getColor('white', WattColor.white),
        this.getColor('grey-50', WattColor.grey50),
        this.getColor('grey-100', WattColor.grey100),
        this.getColor('grey-200', WattColor.grey200),
        this.getColor('grey-300', WattColor.grey300),
        this.getColor('grey-400', WattColor.grey400),
        this.getColor('grey-500', WattColor.grey500),
        this.getColor('grey-600', WattColor.grey600),
        this.getColor('grey-700', WattColor.grey700),
        this.getColor('grey-800', WattColor.grey800),
        this.getColor('grey-900', WattColor.grey900),
      ],
    },
    {
      name: 'state',
      title: 'State Colors',
      description:
        'State color helps users find people, identify status, see actions, locate help, and understand next steps. The consistent use of color keeps cognitive load low and makes for a unified and engaging user experience.',
      colors: [
        this.getColor('danger', WattColor.danger),
        this.getColor('warning', WattColor.warning),
        this.getColor('success', WattColor.success),
        this.getColor('info', WattColor.info),
        this.getColor('danger-light', WattColor.dangerLight),
        this.getColor('warning-light', WattColor.warningLight),
        this.getColor('success-light', WattColor.successLight),
        this.getColor('info-light', WattColor.infoLight),
      ],
    },
    {
      name: 'data',
      title: 'Data Visualization',
      description:
        'Used for graphs and similar, where it is needed to differetiate multiple data.',
      colors: [
        this.getColor('data-1', WattColor.data1),
        this.getColor('data-2', WattColor.data2),
        this.getColor('data-3', WattColor.data3),
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
  private getColor(name: string, color: WattColor) {
    return {
      name,
      var: color,
      color: this.colorHelperService.getColor(color),
      contrast: this.colorHelperService.getColorContrast(color),
    };
  }
}
