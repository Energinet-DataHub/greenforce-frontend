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
import { animate, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-percentage-counter',
  animations: [
    trigger('rollInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('150ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('150ms ease-out', style({ transform: 'translateY(100%)', opacity: 0 })),
      ]),
    ]),
  ],
  styles: `
    eo-percentage-counter {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      min-height: 100vh;
      padding: 96px 50px;

      @media (min-width: 768px) {
        padding-top: 190px;
      }

      .container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .chart {
        z-index: 2;
      }

      .counter {
        position: absolute;
        z-index: 1;
        text-align: center;
        height: 50%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden; // This ensures that parts of the number that move out of view are hidden
      }

      .number {
        position: absolute;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        text-transform: uppercase;
        font-size: clamp(90px, 22vw, 190px);
      }

      .counter::before,
      .counter::after {
        content: '';
        position: absolute;
        left: 0;
        width: 100%;
        height: 30%;
        z-index: 1;
        pointer-events: none;
      }

      .counter::before {
        top: 0;
        background: linear-gradient(to bottom, var(--watt-color-neutral-grey-100), transparent);
      }

      .counter::after {
        bottom: 0;
        background: linear-gradient(to top, var(--watt-color-neutral-grey-100), transparent);
      }

      h2, p {
        text-align: left;

        @media (min-width: 768px) {
          text-align: center;
        }
      }

      h2 {
        margin-top: 72px;
        font-size: 28px;
        font-style: normal;
        font-weight: 400;
        line-height: 34px;
      }

      p {
        margin-top: 24px;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
      }

      p {
        max-width: 438px;
      }
    }
  `,
  template: `
    <div class="container">
      <img class="chart" src="assets/landing-page/animationDonut.svg" />

      <div class="counter">
        @for (num of currentNumbers(); track num) {
          <div class="number" [@rollInOut]>
            <span>{{ num }} %</span>
          </div>
        }
      </div>
    </div>

    <h2>The numbers prove that you run a<br />sustainable company</h2>
    <p>
      Through reports and a dashboard, companies can track their effiency and optimize their
      consumption to match when the sustainable energy is being produced.
    </p>
  `,
})
export class EoPercentageCounterComponent implements AfterViewInit, OnDestroy {
  targetNumber = 95;
  currentNumbers = signal<number[]>([]);
  private ngZone = inject(NgZone);
  private elementRef = inject(ElementRef);
  private frameId: number | null = null;

  ngAfterViewInit(): void {
    this.initObserver();
  }

  ngOnDestroy(): void {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }

  startCounting() {
    let current = 0;
    const step = () => {
      if (current <= this.targetNumber) {
        this.currentNumbers.set([current]);
        current++;
        this.frameId = requestAnimationFrame(step);
      } else if (this.frameId) {
        cancelAnimationFrame(this.frameId);
      }
    };
    this.frameId = requestAnimationFrame(step);
  }

  private initObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.startCounting();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(this.elementRef.nativeElement);
  }
}
