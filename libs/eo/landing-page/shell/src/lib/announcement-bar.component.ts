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
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'eo-announcement-bar',
  styles: `
  :host {
    align-items: center;
    color: var(--watt-color-primary-darker-contrast);
    background: var(--watt-color-primary-darker);
    display: block;
    display: flex;
    font-size: 0.75rem;
    line-height: 1.375rem;
    min-height: 44px;
    padding: var(--watt-space-s);
    text-align: center;
    animation: highlightAnnouncementBar 0.5s forwards; // Add animation property
  }

  @keyframes highlightAnnouncementBar {
    0% { background: var(--watt-color-primary-darker); }
    100% { background: var(--watt-color-primary-ultralight); }
  }
  `,
  template: ` <p role="alert">{{ announcement }}</p> `,
})
export class EoAnnouncementBarComponent {
  @Input() announcement!: string;
}
