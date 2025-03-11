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
import { Component, inject } from '@angular/core';

import { WattColorHelperService } from '../color-helper.service';
import { WattColorType } from '../colors';

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
  private colorHelperService = inject(WattColorHelperService);
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
        this.getColor('primary', 'primary'),
        this.getColor('primary-dark', 'primaryDark'),
        this.getColor('primary-darker', 'primaryDarker'),
        this.getColor('primary-light', 'primaryLight'),
        this.getColor('primary-ultralight', 'primaryUltralight'),
      ],
    },
    {
      name: 'secondary',
      title: 'Secondary Colors',
      colors: [
        this.getColor('secondary', 'secondary'),
        this.getColor('secondary-dark', 'secondaryDark'),
        this.getColor('secondary-light', 'secondaryLight'),
        this.getColor('secondary-ultralight', 'secondaryUltralight'),
      ],
    },
    {
      name: 'neutral',
      title: 'Neutral Colors',
      colors: [
        this.getColor('black', 'black'),
        this.getColor('white', 'white'),
        this.getColor('grey-50', 'grey50'),
        this.getColor('grey-100', 'grey100'),
        this.getColor('grey-200', 'grey200'),
        this.getColor('grey-300', 'grey300'),
        this.getColor('grey-400', 'grey400'),
        this.getColor('grey-500', 'grey500'),
        this.getColor('grey-600', 'grey600'),
        this.getColor('grey-700', 'grey700'),
        this.getColor('grey-800', 'grey800'),
        this.getColor('grey-900', 'grey900'),
      ],
    },
    {
      name: 'state',
      title: 'State Colors',
      description:
        'State color helps users find people, identify status, see actions, locate help, and understand next steps. The consistent use of color keeps cognitive load low and makes for a unified and engaging user experience.',
      colors: [
        this.getColor('danger', 'danger'),
        this.getColor('warning', 'warning'),
        this.getColor('success', 'success'),
        this.getColor('info', 'info'),
        this.getColor('danger-light', 'dangerLight'),
        this.getColor('warning-light', 'warningLight'),
        this.getColor('success-light', 'successLight'),
        this.getColor('info-light', 'infoLight'),
      ],
    },
    {
      name: 'data',
      title: 'Data Visualization',
      description: 'Used for graphs and similar, where it is needed to differetiate multiple data.',
      colors: [
        this.getColor('data-1', 'data1'),
        this.getColor('data-2', 'data2'),
        this.getColor('data-3', 'data3'),
      ],
    },
  ];

  /**
   * @ignore
   */
  copyToClipboard(color: string) {
    navigator.clipboard.writeText(color);
  }

  /**
   * @ignore
   */
  private getColor(name: string, color: WattColorType) {
    return {
      name,
      var: color,
      color: this.colorHelperService.getColor(color),
      contrast: this.colorHelperService.getColorContrast(color),
    };
  }
}
