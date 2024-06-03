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
import { TranslocoPipe } from '@ngneat/transloco';

import { translations } from '@energinet-datahub/eo/translations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'ett-landing-page-how',
  imports: [NgClass, TranslocoPipe],
  encapsulation: ViewEncapsulation.None,
  styles: `
    ett-landing-page-how {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #02525e;
      color: #fff;
      padding: 0 24px 48px 24px;
      --transition: all 1500ms cubic-bezier(0.75, 0, 0.25, 1);
      --scale: scale(1.15766, 1);
      container: ett-landing-page-how / inline-size;

      h3 {
        color: #fff;
        max-width: 475px;
      }

      h2 {
        max-width: 295px;
      }

      h2,
      h3 {
        text-transform: uppercase;
      }

      .highlight {
        color: #13ecb8;
      }

      .heading {
        position: relative;
        z-index: 1;
        border-radius: 32px;
        min-width: calc(100vw + 64px);
        display: flex;
        align-items: center;
        justify-content: center;
        background: url('/assets/landing-page/Rectangle 12 transformed.avif') no-repeat;
        background-position: center;
        background-size: cover;
        flex-direction: column;
        text-align: center;
        padding: 48px 88px;
        gap: 24px;
      }

      .text-container {
        display: flex;
        flex-direction: column;
        margin-top: 48px;
        gap: 16px;
      }
    }

    @container ett-landing-page-how (min-width: 1150px) {
      ett-landing-page-how {
        min-height: 1100px;
        padding: 150px 0;

        * {
          max-width: 888px;
        }

        h3 {
          text-align: left;
          transition: var(--transition);
          max-width: 85%;
        }

        h2 {
          transform: translate3d(0, -200%, 0);
          max-width: 100%;
        }

        .heading {
          min-height: 570px;
          min-width: 888px;
          margin-top: 208px;
          padding: 0;
          transition: var(--transition);
          background: url('/assets/landing-page/Rectangle 12.avif') no-repeat;
          align-items: flex-start;
          justify-content: flex-start;

          &.active {
            background: url('/assets/landing-page/Rectangle 12 transformed.avif') no-repeat;
            min-width: 1028px;
            min-height: 790px;

            h3 {
              transform: translate3d(7.5%, 75%, 0);
            }
          }
        }

        .text-container {
          display: flex;
          gap: 46px;
          margin-top: 80px;
          z-index: 1;
          transition: var(--transition);
          flex-direction: row;

          &.active {
            transform: translate3d(0, -200%, 0);
          }
        }
      }
    }
  `,
  template: `
    <div class="heading" [ngClass]="{ active: isActive() }">
      <h2 class="highlight headline-4">{{ translations.landingPage.how.heading | transloco }}</h2>
      <h3 class="headline-1" [innerHTML]="translations.landingPage.how.subheading | transloco"></h3>
    </div>

    <section
      class="text-container"
      [ngClass]="{ active: isActive() }"
      [innerHTML]="translations.landingPage.how.content | transloco"
    ></section>
  `,
})
export class EoLandingPageHowComponent implements AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;
  private elementRef = inject(ElementRef);

  protected translations = translations;
  protected isActive = signal<boolean>(false);

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && this.isActive() === false) {
            this.isActive.set(true);
          } else if (!entry.isIntersecting && this.isActive() === true) {
            this.isActive.set(false);
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
