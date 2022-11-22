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
const materialIcons = {
  // Essentials
  search: 'search',
  filter: 'filter_list',
  plus: 'add',
  minus: 'remove',
  edit: 'edit',
  redo: 'redo',
  remove: 'delete',
  close: 'close',
  cancel: 'cancel',
  checkmark: 'check',
  user: 'account_circle',
  settings: 'settings',
  contentCopy: 'content_copy',
  date: 'calendar_today',
  time: 'schedule',
  email: 'email',
  link: 'link',
  openInNew: 'open_in_new',
  monetization: 'monetization_on',
  payments: 'payments',
  forwardMessage: 'forward_to_inbox',
  menu: 'menu',
  logout: 'logout',
  // Navigation
  left: 'navigate_before',
  right: 'navigate_next',
  up: 'expand_less',
  down: 'expand_more',
  // Alerts
  danger: 'dangerous',
  warning: 'report_problem',
  success: 'check_circle',
  info: 'info',
  // Files
  save: 'save_alt',
  upload: 'cloud_upload',
  download: 'cloud_download',
  print: 'print',
  preview: 'preview',
  // Other
  power: 'power',
  location: 'location_on',
};

/**
 * Icons manually registered
 */
export const customIcons = {
  'custom-power': 'power',
  'custom-explore': 'explore',
  'custom-meter': 'meter',
  'custom-map-marker': 'map-marker',
  'custom-primary-info': 'primary-info',
  'custom-noResults': 'noResults',
};

export const allIcons = { ...materialIcons, ...customIcons };
export type WattIcon = keyof typeof allIcons;
export type WattCustomIcon = keyof typeof customIcons;
