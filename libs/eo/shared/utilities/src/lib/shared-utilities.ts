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

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SharedUtilities {
  scrollToAnchor(element: string): void {
    document.getElementById(element)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  isDateActive(startDate: number | undefined, endDate: number | null): boolean {
    if (!startDate) return false;

    const now = new Date().getTime();
    return startDate <= now && (endDate || now) >= now;
  }

  checkForMidnightInLocalTime(inputDate: number | undefined): number {
    if (!inputDate) return 0;

    const date = new Date(inputDate);
    return date.getHours() === 0 ? date.setDate(date.getDate() - 1) : date.getTime();
  }
}
