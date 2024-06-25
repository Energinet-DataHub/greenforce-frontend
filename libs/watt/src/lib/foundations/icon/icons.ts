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
  undo: 'undo',
  remove: 'delete',
  removeForever: 'delete_forever',
  close: 'close',
  cancel: 'cancel',
  checkmark: 'check',
  user: 'account_circle',
  settings: 'settings',
  contentCopy: 'content_copy',
  date: 'calendar_today',
  time: 'schedule',
  email: 'email',
  markEmailUnread: 'mark_email_unread',
  link: 'link',
  openInNew: 'open_in_new',
  monetization: 'monetization_on',
  payments: 'payments',
  forwardMessage: 'forward_to_inbox',
  menu: 'menu',
  logout: 'logout',
  login: 'lock_open',
  help: 'help',
  alternateEmail: 'alternate_email',
  refresh: 'refresh',
  language: 'language',
  pendingActions: 'pending_actions',
  toggleOn: 'toggle_on',
  toggleOff: 'toggle_off',
  // Navigation
  left: 'navigate_before',
  right: 'navigate_next',
  up: 'expand_less',
  down: 'expand_more',
  arrowDropDown: 'arrow_drop_down',
  arrowRightAlt: 'arrow_right_alt',
  account: 'account_circle',
  // Alerts
  danger: 'dangerous',
  warning: 'report_problem',
  success: 'check_circle',
  info: 'info',
  feedback: 'feedback',
  // Files
  save: 'save_alt',
  upload: 'cloud_upload',
  download: 'cloud_download',
  fileDownload: 'download',
  print: 'print',
  preview: 'preview',
  // Other
  power: 'power',
  location: 'location_on',
  smartDisplay: 'smart_display',
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
  'custom-no-results': 'no-results',
  'custom-flag-da': 'flag-da',
  'custom-flag-de': 'flag-de',
  'custom-flag-se': 'flag-se',
  'custom-flag-no': 'flag-no',
  'custom-flag-fi': 'flag-fi',
  'custom-flag-pl': 'flag-pl',
  'custom-assignment-add': 'assignment-add',
};

export const allIcons = { ...materialIcons, ...customIcons };
export type WattIcon = keyof typeof allIcons;
export type WattCustomIcon = keyof typeof customIcons;
