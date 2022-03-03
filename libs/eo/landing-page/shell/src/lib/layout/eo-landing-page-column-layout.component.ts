import {
  Component,
  NgModule,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export enum layoutTypeEnum {
  FULL = 'full',
  SMALL_FIRST = 'smallFirst',
  LARGE_FIRST = 'largeFirst',
}

const selector = 'eo-landing-page-column-layout';

@Component({
  selector,
  styles: [
    `
      ${selector} {
        display: block;
      }

      .${selector}__display-flex {
        display: flex;
        align-items: center;
      }

      .${selector}__content {
        // This is the rows which contain either on or two columns
        position: relative;
        width: 100%;
        max-width: 1280px; // Defined in Figma
        margin: 0 auto;
      }
      .${selector}__column--large {
        width: 60%;
        display: inline-block;
      }
      .${selector}__column--small {
        width: 40%;
        display: inline-block;
      }
    `,
  ],
  template: `
    <ng-container *ngIf="layoutType === layoutTypeEnum.FULL">
      <div class="${selector}__content watt-space-inset-xl">
        <ng-content></ng-content>
      </div>
    </ng-container>

    <ng-container *ngIf="layoutType === layoutTypeEnum.SMALL_FIRST">
      <div class="${selector}__content ${selector}__display-flex">
        <div
          class="${selector}__column--small watt-space-inset-l eo-padding-left-none"
        >
          <ng-content select="[contentLeftSmall]"></ng-content>
        </div>
        <div class="${selector}__column--large">
          <ng-content select="[contentRightLarge]"></ng-content>
        </div>
      </div>
    </ng-container>

    <ng-container *ngIf="layoutType === layoutTypeEnum.LARGE_FIRST">
      <div class="${selector}__content ${selector}__display-flex">
        <div class="${selector}__column--large">
          <ng-content select="[contentLeftLarge]"></ng-content>
        </div>
        <div class="${selector}__column--small watt-space-inset-l">
          <ng-content select="[contentRightSmall]"></ng-content>
        </div>
      </div>
    </ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoLandingPageColumnLayoutComponent {
  @Input()
  layoutType: 'full' | 'smallFirst' | 'largeFirst' = layoutTypeEnum.FULL;

  layoutTypeEnum = layoutTypeEnum;
}

@NgModule({
  declarations: [EoLandingPageColumnLayoutComponent],
  exports: [EoLandingPageColumnLayoutComponent],
  imports: [CommonModule],
})
export class EoLandingPageColumnLayoutScam {}
