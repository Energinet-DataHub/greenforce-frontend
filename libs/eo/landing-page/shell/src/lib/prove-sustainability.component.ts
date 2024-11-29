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

import { sustainableChart } from '@energinet-datahub/eo/shared/assets';
import { translations } from '@energinet-datahub/eo/translations';

import { EoLottieComponent } from './eo-lottie.component';

const selector = 'eo-landing-page-prove-sustainability';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  selector,
  imports: [EoLottieComponent, TranslocoPipe],
  styles: `
    ${selector} {
      background: #f9f9f9;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      padding: 18px 24px 48px 24px;

      @media (min-width: 768px) {
        padding-top: 160px;
        justify-content: center;
      }

      h2,
      p {
        text-align: left;

        @media (min-width: 768px) {
          text-align: center;
        }
      }

      h2 {
        margin-top: 16px;

        @media (min-width: 768px) {
          margin-top: 32px;
        }
      }

      p {
        margin-top: 24px;

        @media (min-width: 768px) {
          max-width: 438px;
        }
      }

      @media screen and (orientation: landscape) and (max-width: 960px) {
        eo-lottie {
          max-width: 60vh;
        }
      }
    }
  `,
  template: `
    <eo-lottie
      #animation
      height="auto"
      width="100%"
      [animationData]="sustainableChart"
      [autoPlay]="false"
    />

    <h2
      class="headline-3"
      [innerHTML]="translations.landingPage.proveSustainability.heading | transloco"
    ></h2>
    <p [innerHTML]="translations.landingPage.proveSustainability.content | transloco"></p>
  `,
})
export class EoLandingPageProveSustainabilityComponent implements AfterViewInit, OnDestroy {
  @ViewChild('animation') private animation!: EoLottieComponent;

  private observer!: IntersectionObserver;
  private elementRef = inject(ElementRef);

  protected translations = translations;
  protected sustainableChart = sustainableChart;

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
