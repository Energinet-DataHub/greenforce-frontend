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
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { allIcons, customIcons, WattCustomIcon, WattIcon } from './icons';

@Injectable({ providedIn: 'root' })
export class WattIconService {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.registerCustomIcons();
    this.iconRegistry.setDefaultFontSetClass('material-symbols-sharp');
  }

  isCustomIcon(icon: WattIcon): boolean {
    return Object.keys(customIcons).includes(icon);
  }

  getIconName(icon: WattIcon) {
    return allIcons[icon];
  }

  private registerCustomIcons() {
    this.addSvgIcon('custom-explore', '/assets/watt/icons/explore.svg');
    this.addSvgIcon('custom-power', '/assets/watt/icons/power.svg');
    this.addSvgIcon('custom-meter', '/assets/watt/icons/meter.svg');
    this.addSvgIcon('custom-map-marker', '/assets/watt/icons/map-marker.svg');
    this.addSvgIcon('custom-primary-info', '/assets/watt/icons/primary-info.svg');
    this.addSvgIcon('custom-no-results', '/assets/watt/icons/noResults.svg');
    this.addSvgIcon('custom-flag-da', '/assets/watt/icons/flags/da.svg');
    this.addSvgIcon('custom-flag-se', '/assets/watt/icons/flags/se.svg');
    this.addSvgIcon('custom-flag-de', '/assets/watt/icons/flags/de.svg');
    this.addSvgIcon('custom-flag-no', '/assets/watt/icons/flags/no.svg');
    this.addSvgIcon('custom-flag-fi', '/assets/watt/icons/flags/fi.svg');
    this.addSvgIcon('custom-flag-pl', '/assets/watt/icons/flags/pl.svg');
    this.addSvgIcon('custom-assignment-add', '/assets/watt/icons/assignment-add.svg');
  }

  private addSvgIcon(icon: WattCustomIcon, url: string) {
    this.iconRegistry.addSvgIcon(
      this.getIconName(icon),
      this.sanitizer.bypassSecurityTrustResourceUrl(url)
    );
  }
}
