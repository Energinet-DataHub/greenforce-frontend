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
import { Injectable } from '@angular/core';
import Clarity from '@microsoft/clarity';

export interface MicrosoftClarityConfig {
  projectId: string;
}

@Injectable({
  providedIn: 'root',
})
export class DhMicrosoftClarityService {
  private isInitialized = false;

  init(config: MicrosoftClarityConfig | undefined): void {
    if (this.isInitialized) {
      return;
    }

    // Validate configuration
    if (!config?.projectId) {
      console.warn('Microsoft Clarity initialization skipped: No valid project ID provided');
      return;
    }

    try {
      // Initialize Clarity using the SDK
      Clarity.init(config.projectId);
      this.isInitialized = true;
    } catch (error) {
      // Log error but don't throw - Microsoft Clarity should not break the app
      console.warn('Error initializing Microsoft Clarity:', error);
    }
  }

  setCookieConsent(consent: boolean): void {
    if (!this.isInitialized) {
      return;
    }

    try {
      // Call Clarity's consent method
      Clarity.consent(consent);
    } catch (error) {
      console.warn('Error setting Clarity consent:', error);
    }
  }
}
