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
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DhIframeService {
  readonly isInIframe = signal(globalThis.self !== globalThis.top);

  updateTitle(title: string): void {
    if (this.isInIframe()) {
      globalThis.parent.postMessage({ type: 'TITLE_UPDATE', title }, globalThis.location.origin);
    }
  }

  /**
   * Breaks out of the iframe by navigating the top window.
   * Uses location.replace() to avoid creating browser history entries.
   * Used for authentication flows that require redirect.
   */
  breakOutOfIframe(url: string): void {
    if (this.isInIframe() && globalThis.top) {
      globalThis.top.location.replace(url);
    } else {
      globalThis.location.replace(url);
    }
  }

  /**
   * Notifies the parent wrapper that authentication is required.
   * The wrapper will redirect to full-page login.
   */
  requestAuthentication(): void {
    if (this.isInIframe()) {
      globalThis.parent.postMessage({ type: 'AUTH_REQUIRED' }, globalThis.location.origin);
    } else {
      // If not in iframe, redirect directly to app.html for login
      globalThis.location.replace('app.html');
    }
  }
}
