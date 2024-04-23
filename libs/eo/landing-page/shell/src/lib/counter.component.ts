/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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

import { EoLottieComponent } from './eo-lottie.component';
import { sustainableChart } from '@energinet-datahub/eo/shared/assets';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-percentage-counter',
  imports: [EoLottieComponent],
  styles: `
    eo-percentage-counter {
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
        font-size: 28px;
        font-style: normal;
        font-weight: 400;
        line-height: 34px;

        @media (min-width: 768px) {
          margin-top: 32px;
        }
      }

      p {
        margin-top: 24px;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;

        @media (min-width: 768px) {
          max-width: 438px;
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

    <h2>The numbers prove that you run a<br />sustainable company</h2>
    <p>
      Through reports and a dashboard, companies can track their effiency and optimize their
      consumption to match when the sustainable energy is being produced.
    </p>
  `,
})
export class EoPercentageCounterComponent implements AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;
  private elementRef = inject(ElementRef);

  @ViewChild('animation') private animation!: EoLottieComponent;
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
