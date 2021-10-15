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
import { WattIcon } from '../icons';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-icon-overview',
  templateUrl: './storybook-icon-overview.component.html',
  styleUrls: ['./storybook-icon-overview.component.scss'],
})
export class StorybookIconOverviewComponent {
  /**
   * @ignore
   */
  icons = [
    {
      name: null,
      icons: [
        { name: 'Search', icon: WattIcon.search },
        { name: 'Filter', icon: WattIcon.filter },
        { name: 'Plus', icon: WattIcon.plus },
        { name: 'Minus', icon: WattIcon.minus },
      ],
    },
    {
      name: null,
      icons: [
        { name: 'Edit', icon: WattIcon.edit },
        { name: 'Remove', icon: WattIcon.remove },
      ],
    },
    {
      name: null,
      icons: [
        { name: 'Close', icon: WattIcon.close },
        { name: 'Checkmark', icon: WattIcon.checkmark },
      ],
    },
    {
      name: null,
      icons: [
        { name: 'User', icon: WattIcon.user },
        { name: 'Settings', icon: WattIcon.settings },
      ],
    },
    {
      name: null,
      icons: [
        { name: 'Date', icon: WattIcon.date },
        { name: 'Time', icon: WattIcon.time },
      ],
    },
    {
      name: null,
      icons: [
        { name: 'E-mail', icon: WattIcon.email },
        { name: 'Link', icon: WattIcon.link },
      ],
    },
    {
      name: 'navigation',
      icons: [
        { name: 'Left', icon: WattIcon.left },
        { name: 'Right', icon: WattIcon.right },
        { name: 'Up', icon: WattIcon.up },
        { name: 'Down', icon: WattIcon.down },
      ],
    },
    {
      name: 'alerts',
      icons: [
        { name: 'Danger', icon: WattIcon.danger },
        { name: 'Warning', icon: WattIcon.warning },
        { name: 'Success', icon: WattIcon.success },
        { name: 'Info', icon: WattIcon.info },
      ],
    },
    {
      name: 'files',
      icons: [
        { name: 'Upload', icon: WattIcon.upload },
        { name: 'Download', icon: WattIcon.download },
        { name: 'Print', icon: WattIcon.print },
        { name: 'Preview', icon: WattIcon.preview },
      ],
    },
  ];

  /**
   * @ignore
   */
  copyToClipboard(color: string) {
    `var(${navigator.clipboard.writeText(color)})`;
  }
}
