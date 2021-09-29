import { DOCUMENT } from '@angular/common';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Colors } from './colors';

@Injectable({
  providedIn: 'root',
})
export class ColorHelperService {
  private colorContrastSuffix = 'contrast';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private window: Window
  ) {}

  public getColor(colorName: Colors): string {
    return this.getComputedStyle().getPropertyValue(colorName);
  }

  public getColorContrast(colorName: Colors): string {
    return this.getComputedStyle().getPropertyValue(
      `${colorName}-${this.colorContrastSuffix}`
    );
  }

  private getComputedStyle() {
    return this.window.getComputedStyle(this.document.documentElement);
  }
}
