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
const icons = {
  // Essentials
  search: 'search',
  filter: 'filter_list',
  plus: 'add',
  minus: 'remove',
  edit: 'edit',
  remove: 'delete',
  close: 'close',
  checkmark: 'check',
  user: 'account_circle',
  settings: 'settings',
  date: 'calendar_today',
  time: 'schedule',
  email: 'email',
  link: 'link',
  monetization: 'monetization_on',
  forwardMessage: 'forward_to_inbox',
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
  upload: 'cloud_upload',
  download: 'cloud_download',
  print: 'print',
  preview: 'preview',
};

/**
 * Icons manually registered
 */
export const customIcons = {
  power: 'power',
  explore: 'explore',
  meter: 'meter',
  map_marker: 'map_marker',
};

export const allIcons = { ...icons, ...customIcons };
export type WattIcon = keyof typeof allIcons;
