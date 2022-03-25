import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-media-image',
  styles: [
    `
      :host {
        display: block;
        flex: 1 1;

        max-width: 54.1666667%; // Image is max 520px in a 960px wrapper.
        margin-left: 40px;
      }
    `,
  ],
  template: `<ng-content></ng-content>`,
})
export class EoMediaImageComponent {}

@NgModule({
  declarations: [EoMediaImageComponent],
  exports: [EoMediaImageComponent],
})
export class EoMediaImageScam {}
