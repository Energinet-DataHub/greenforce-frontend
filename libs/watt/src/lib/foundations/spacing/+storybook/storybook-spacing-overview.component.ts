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
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

interface Scale {
  name: string;
  sizePx: number;
  sizeRem: number;
}

const spacingScales: Scale[] = [
  {
    name: 'space-xs',
    sizePx: 4,
    sizeRem: 0.25,
  },
  {
    name: 'space-s',
    sizePx: 8,
    sizeRem: 0.5,
  },
  {
    name: 'space-m',
    sizePx: 16,
    sizeRem: 1,
  },
  {
    name: 'space-l',
    sizePx: 32,
    sizeRem: 2,
  },
  {
    name: 'space-xl',
    sizePx: 64,
    sizeRem: 4,
  },
];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-spacing-overview',
  templateUrl: './storybook-spacing-overview.component.html',
  styleUrls: ['./storybook-spacing-overview.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
})
export class StorybookSpacingOverviewComponent {
  displayedColumns: string[] = ['name', 'sizePx', 'sizeRem', 'visualExample'];

  dataSource = spacingScales;
}
