import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WattCssCustomPropertiesService {
  private get rootElement() {
    return this.document.documentElement;
  }

  constructor(@Inject(DOCUMENT) private document: Document) {}

  public getPropertyValue(name: string): string {
    return getComputedStyle(this.rootElement).getPropertyValue(name);
  }

  public setPropertyValue(name: string, value: string): void {
    this.rootElement.style.setProperty(name, value);
  }
}
