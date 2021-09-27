import { DOCUMENT } from '@angular/common';
import {
  Inject,
  Injectable,
  Renderer2,
  RendererFactory2,
  RendererStyleFlags2,
} from '@angular/core';
import { Colors } from './colors';

@Injectable({
  providedIn: 'root',
})
export class ColorHelperService {
  private renderer: Renderer2;
  private colorContrastSuffix = 'contrast';

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
    private window: Window
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public getColor(colorName: Colors): string {
    return this.getComputedStyle().getPropertyValue(colorName);
  }

  public getColorContrast(colorName: Colors): string {
    return this.getComputedStyle().getPropertyValue(
      `${colorName}-${this.colorContrastSuffix}`
    );
  }

  public getAvailableColors(): string[] {
    return Object.keys(Colors);
  }

  public updateColor(
    colorName: Colors,
    color: string,
    colorContrast: Colors.black | Colors.white
  ): void {
    this.renderer.setStyle(
      this.document.documentElement,
      colorName,
      color,
      RendererStyleFlags2.DashCase
    );
    this.renderer.setStyle(
      this.document.documentElement,
      `${colorName}-${this.colorContrastSuffix}`,
      colorContrast,
      RendererStyleFlags2.DashCase
    );
  }

  private getComputedStyle() {
    return this.window.getComputedStyle(this.document.documentElement);
  }
}
