import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';

import { naming } from '@energinet-datahub/eo/shared/assets';
import { translations } from '@energinet-datahub/eo/translations';

import { EoLottieComponent } from './eo-lottie.component';

const selector = 'eo-landing-page-naming';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  selector,
  imports: [EoLottieComponent, TranslocoPipe],
  styles: `
    ${selector} {
      display: flex;
      justify-content: center;
      background: #f9f9f9;
      padding: 18px 24px 18px 24px;

      @media (min-width: 768px) {
        padding-top: 160px;
        padding-bottom: 160px;
      }

      .container {
        max-width: 1300px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;

        @media (min-width: 768px) {
          flex-direction: row;
        }

        > * {
          flex: 1 1 50%;
        }
      }

      rect {
        fill: transparent;
      }

      .headline-3:has(+ .text) {
        margin-bottom: var(--watt-space-l);
      }

      .text {
        display: flex;
        flex-direction: column;
        white-space: pre-line;
      }
    }
  `,
  template: `
    <div class="container">
      <eo-lottie
        #animation
        height="auto"
        width="100%"
        [animationData]="namingAnimation"
        [autoPlay]="false"
      />

      <div class="content">
        <h2
          class="headline-3"
          [innerHTML]="translations.landingPage.naming.heading | transloco"
        ></h2>
        <div class="text" [innerHTML]="translations.landingPage.naming.content | transloco"></div>
      </div>
    </div>
  `,
})
export class EoLandingPageNamingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('animation') private animation!: EoLottieComponent;

  private observer!: IntersectionObserver;
  private elementRef = inject(ElementRef);

  protected translations = translations;
  protected namingAnimation = naming;

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animation.play();
            this.observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }
}
