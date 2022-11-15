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

import { WattIcon } from '../icons';

interface Icon {
  name: string;
  icon: WattIcon;
}

interface IconGroup {
  name?: string;
  icons: Icon[];
}

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
  icons: IconGroup[] = [
    {
      icons: [
        { name: 'Search', icon: 'search' },
        { name: 'Filter', icon: 'filter' },
        { name: 'Plus', icon: 'plus' },
        { name: 'Minus', icon: 'minus' },
      ],
    },
    {
      icons: [
        { name: 'Edit', icon: 'edit' },
        { name: 'Remove', icon: 'remove' },
        { name: 'Menu', icon: 'menu' },
        { name: 'Log out', icon: 'logout' },
      ],
    },
    {
      icons: [
        { name: 'Redo', icon: 'redo' },
        { name: 'Close', icon: 'close' },
        { name: 'Cancel', icon: 'cancel' },
        { name: 'Checkmark', icon: 'checkmark' },
      ],
    },
    {
      icons: [
        { name: 'User', icon: 'user' },
        { name: 'Settings', icon: 'settings' },
        { name: 'ContentCopy', icon: 'contentCopy' },
      ],
    },
    {
      icons: [
        { name: 'Date', icon: 'date' },
        { name: 'Time', icon: 'time' },
      ],
    },
    {
      icons: [
        { name: 'E-mail', icon: 'email' },
        { name: 'Link', icon: 'link' },
        { name: 'Open In New', icon: 'openInNew' },
      ],
    },
    {
      name: 'navigation',
      icons: [
        { name: 'Left', icon: 'left' },
        { name: 'Right', icon: 'right' },
        { name: 'Up', icon: 'up' },
        { name: 'Down', icon: 'down' },
      ],
    },
    {
      name: 'alerts',
      icons: [
        { name: 'Danger', icon: 'danger' },
        { name: 'Warning', icon: 'warning' },
        { name: 'Success', icon: 'success' },
        { name: 'Info', icon: 'info' },
      ],
    },
    {
      name: 'files',
      icons: [
        { name: 'Save', icon: 'save' },
        { name: 'Upload', icon: 'upload' },
        { name: 'Download', icon: 'download' },
        { name: 'Print', icon: 'print' },
        { name: 'Preview', icon: 'preview' },
      ],
    },
    {
      icons: [
        { name: 'Forward Message', icon: 'forwardMessage' },
        { name: 'Monetization', icon: 'monetization' },
        { name: 'Payments', icon: 'payments' },
      ],
    },
    {
      icons: [
        { name: 'power', icon: 'power' },
        { name: 'location', icon: 'location' },
      ],
    },
  ];
}
