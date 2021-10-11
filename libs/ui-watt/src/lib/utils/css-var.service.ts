import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WattCSSVarService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private window: Window
  ) {}

  public getVar(name: string): string {
    return this.getComputedStyle().getPropertyValue(name);
  }

  private getComputedStyle() {
    return this.window.getComputedStyle(this.document.documentElement);
  }
}
