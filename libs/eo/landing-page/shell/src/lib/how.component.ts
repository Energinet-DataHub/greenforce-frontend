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
import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'eo-landing-page-how',
  imports: [NgClass],
  encapsulation: ViewEncapsulation.None,
  styles: `
    eo-landing-page-how {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #02525E;
      color: #fff;
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      line-height: 28px;
      padding: 150px 0;
    }

    eo-landing-page-how .highlight {
      color: #13ECB8;
    }

    eo-landing-page-how .heading-container {
      position: relative;
      display: flex;
      flex-direction: column;
    }

    eo-landing-page-how .how-heading, eo-landing-page-how .how-subheading {
      text-transform: uppercase;
    }

    eo-landing-page-how .how-heading {
      position: relative;
      font-size: 62px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      color: #fff;
      margin-top: 32px;
      z-index: 1;
      height: 570px;
      padding-top: 150px;
      transition: all .5s ease-in-out;

      ::before, ::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #02525E;
        opacity: .4;
        border-radius: 32px;
        z-index: -1;
        transition: all .5s ease-in-out;
      }

      ::before {
        background: url('/assets/landing-page/landscape.jpg') lightgray 0px -30.791px / 100% 137.634% no-repeat;
      }

      ::after {
        background: url('/assets/landing-page/windmills.jpg') lightgray 50% / cover no-repeat;
        opacity: 0;
      }

      &.active {
        height: 790px;
        padding-top: 280px;

        ::after {
          opacity: 0.4;
          transform: scale(1.2, 1);
        }
        ::before {
          opacity: 0;
          transform: scale(1.2, 1);
        }
      }
    }

    eo-landing-page-how .how-subheading {
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: 0.54px;
      order: -1;
    }

    eo-landing-page-how section {
      max-width: 888px;
    }

    eo-landing-page-how .text-container {
      display: flex;
      gap: 46px;
      margin-top: 80px;
      z-index: 1;
      transition: all .5s ease-in-out;

      &.active {
        transform: translate3d(0, -200px, 0);
        height: 0;
        margin: 0;
      }
    }
  `,
  template: `
    <section aria-labelledby="how-heading" class="heading-container">
      <!-- Main heading of the hero component -->
      <h2 id="hero-heading" class="how-heading active" [ngClass]="{ active: isActive() }">
        Fast-Track Compliance with <span class="highlight">EU Sustainability</span><br />Regulations
      </h2>

      <p class="how-subheading highlight">how we make sustainability reporting easier</p>
    </section>

    <section aria-labeledby="how-text" class="text-container" [ngClass]="{ active: isActive() }">
      <p>
        Energy Origin emerges as a transformative solution designed to guide companies through the
        complexities of adhering to the EU's Corporate Sustainability Reporting Directive (CSRD) and
        Environmental, Social, and Governance (ESG) directives.
      </p>
      <p>
        By leveraging advanced blockchain technology to provide unassailable traceability of
        sustainable energy back to its source, Energy Origin offers businesses a robust tool to
        validate their green energy commitments.
      </p>
    </section>
  `,
})
export class EoLandingPageHowComponent implements AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;
  private elementRef = inject(ElementRef);
  protected isActive = signal<boolean>(false);

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.isActive.set(true);
          } else {
            this.isActive.set(false);
          }
        });
      },
      { threshold: 0.8 }
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }
}
