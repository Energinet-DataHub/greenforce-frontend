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
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'eo-announcement-bar',
  encapsulation: ViewEncapsulation.None,
  styles: `
  :root {
    --eo-announcement-bar-animation-duration: 1s;
  }

  eo-announcement-bar {
    align-items: center;
    display: flex;
    min-height: 44px;
    padding: var(--watt-space-s);
    text-align: center;
    justify-content: center;
    animation: highlightAnnouncementBar var(--eo-announcement-bar-animation-duration) forwards;
  }

  eo-announcement-bar a {
    animation: animateLinkColor var(--eo-announcement-bar-animation-duration) forwards;
  }

  eo-announcement-bar p, eo-announcement-bar a {
    font-size: 0.75rem !important;
    line-height: 1.375rem !important;
  }

  @keyframes animateLinkColor {
    0%, 50% {
      color: var(--watt-color-primary-darker-contrast);
    }
    100% {
      color: var(--watt-typography-link-color);
    }
  }

  @keyframes highlightAnnouncementBar {
    0%, 50% {
      background: var(--watt-color-primary-darker);
      color: var(--watt-color-primary-darker-contrast);
    }
    100% {
      background: var(--watt-color-primary-ultralight);
      color: var(--watt-color-primary-ultralight-contrast);
    }
  }
  `,
  template: `<p role="alert" [innerHTML]="announcement"></p>`,
})
export class EoAnnouncementBarComponent {
  @Input() announcement!: string;
}
