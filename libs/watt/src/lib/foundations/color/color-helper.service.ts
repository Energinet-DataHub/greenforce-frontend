import { Injectable } from '@angular/core';

import { WattCssCustomPropertiesService } from '../../utils/css-custom-properties.service';
import { WattColor } from './colors';

@Injectable({
  providedIn: 'root',
})
export class WattColorHelperService {
  private colorContrastSuffix = 'contrast';

  constructor(private cssCustomPropertiesService: WattCssCustomPropertiesService) {}

  public getColor(color: WattColor): string {
    return this.cssCustomPropertiesService.getPropertyValue(color);
  }

  public getColorContrast(color: WattColor): string {
    return this.cssCustomPropertiesService.getPropertyValue(`${color}-${this.colorContrastSuffix}`);
  }
}
