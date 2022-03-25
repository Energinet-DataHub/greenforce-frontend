import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-media',
  styles: [
    `
      :host {
        display: flex;
      }

      .media___body {
        flex: 1 1;
      }
    `,
  ],
  template: `
    <div class="media___body">
      <ng-content></ng-content>
    </div>

    <ng-content select="eo-media-image"></ng-content>
  `,
})
export class EoMediaComponent {}

@NgModule({
  declarations: [EoMediaComponent],
  exports: [EoMediaComponent],
})
export class EoMediaScam {}
