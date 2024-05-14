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
import { NgClass, NgStyle, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  PLATFORM_ID,
  ViewEncapsulation,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoPipe } from '@ngneat/transloco';
import { filter } from 'rxjs';

import { translations } from '@energinet-datahub/eo/translations';

interface Section {
  title?: string;
  id: string;
  headline: string;
  content: string;
  images: Image[];
}

interface Image {
  zIndex: string;
  x?: string;
  y?: string;
  width: string;
  height: string;
  srcset: string;
  transform?: string;
  transitionFrom?: number;
}

@Component({
  standalone: true,
  selector: 'eo-landing-page-what',
  imports: [NgClass, NgStyle, TranslocoPipe],
  encapsulation: ViewEncapsulation.None,
  styles: `
    eo-landing-page-what {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      --on-light-high-emphasis: rgba(0, 0, 0, 0.87);
      padding: 48px 24px;
      background: #f9f9f9;

      @media (min-width: 1024px) {
        display: grid;
        grid-template-columns: 55% 1fr;
        grid-template-rows: 1fr;
        gap: 0px 0px;
        grid-template-areas: 'images content';
        padding: 6vw 24px 12vw 24px;
      }

      .headline {
        max-width: 350px;
      }

      .headline-4 {
        color: #02525e;
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        letter-spacing: 0.54px;
        text-transform: uppercase;
      }

      .headline-3 {
        color: var(--on-light-high-emphasis, rgba(0, 0, 0, 0.87));
        font-size: 28px;
        font-style: normal;
        font-weight: 400;
        line-height: 34px;

        &:has(+ p) {
          margin-bottom: 27px;
        }
      }

      p {
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
      }

      nav {
        a {
          font-size: 40px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          text-decoration: none;
          color: rgba(189, 189, 189, 0.87);

          &.active,
          &:hover {
            color: #0a515d;
          }

          &::after {
            content: '';
            display: block;
            width: 100%;
            height: 2px;
            background: #00847c;
            margin-top: 4px;
            opacity: 0;
          }

          &.active::after {
            opacity: 1;
          }
        }

        ul {
          display: flex;
          flex-direction: column;
          gap: 27px;

          li {
            padding-left: 0;
            &::before {
              display: none;
            }
          }
        }
      }

      .images {
        position: relative;
        grid-area: images;
        display: flex;

        img {
          position: absolute;
          transition: all 1500ms cubic-bezier(0.77, 0, 0.28, 1);
          border-radius: 30px;
        }
      }

      .images-container {
        position: absolute;
        width: 100%;
        height: 100vh;
      }

      .content {
        display: grid;
        grid-area: content;
        align-content: center;
        grid-template-columns: 1fr;
        grid-template-rows: 0.5fr 2fr 1fr;
        gap: 76px 0px;
        grid-template-areas:
          'headline'
          'nav'
          'content';
        max-height: 1018px;

        .headline {
          grid-area: headline;
          display: flex;
          align-items: flex-end;
        }

        nav {
          grid-area: nav;
          display: flex;
          align-items: center;
        }

        .content-text {
          grid-area: content;
          align-content: center;
        }
      }

      h3 {
        color: rgba(0, 0, 0, 0.87);
        font-size: 36px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        text-align: center;

        @media (min-width: 1024px) {
          text-align: left;
        }
      }

      .content-text {
        transition: opacity 1500ms cubic-bezier(0.77, 0, 0.28, 1);
        height: 0;
      }

      section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 30px 0;
        margin-top: 48px;

        @media (min-width: 1024px) {
          margin-top: 0;
        }
      }
    }
  `,
  template: `
    @if (showLarge) {
      <section aria-hidden class="images">
        @for (section of sections(); track section.id) {
          <div class="images-container" [ngClass]="{ active: section.id === activeSection().id }">
            @for (image of section.images; track image.srcset; let idx = $index) {
              <div class="image-container">
                <img
                  aria-hidden="true"
                  [attr.width]="activeSection().images[idx].width"
                  [attr.height]="activeSection().images[idx].height"
                  [style.z-index]="activeSection().images[idx].zIndex"
                  [srcset]="image.srcset"
                  [sizes]="activeSection().images[idx].width"
                  [ngStyle]="{
                    width: activeSection().images[idx].width,
                    height: activeSection().images[idx].height,
                    transform:
                      'translate3d(' +
                      activeSection().images[idx].x +
                      ', ' +
                      activeSection().images[idx].y +
                      ', 0) translate3d(-50%, -50%, 0) ',
                    opacity: activeSection().id === section.id ? 1 : 0
                  }"
                />
              </div>
            }
          </div>
        }
      </section>

      <section class="content">
        <h2 class="headline headline-4">{{ translations.landingPage.what.heading | transloco }}</h2>

        <nav>
          <ul>
            @for (section of sections(); track section.id) {
              <li>
                <a
                  href="#{{ section.id }}"
                  (click)="activeSection.set(section)"
                  [ngClass]="{ active: activeSection().id === section.id }"
                  >{{ section.title | transloco }}</a
                >
              </li>
            }
          </ul>
        </nav>

        @for (section of sections(); track section.id) {
          <div class="content-text" [style.opacity]="activeSection().id === section.id ? 1 : 0">
            <h3 class="headline-3">{{ section.headline | transloco }}</h3>
            <p [innerHTML]="section.content | transloco"></p>
          </div>
        }
      </section>
    } @else {
      <h2 class="headline headline-4">{{ translations.landingPage.what.heading | transloco }}</h2>

      @for (section of sections(); track section.id; let idx = $index) {
        <section>
          <h3>{{ section.title | transloco }}</h3>

          <picture aria-hidden="true">
            <source
              [srcset]="
                '/assets/landing-page/' +
                section.id +
                '.avif 1x,' +
                '/assets/landing-page/' +
                section.id +
                '@2x.avif 2x,' +
                '/assets/landing-page/' +
                section.id +
                '@3x.avif 3x'
              "
              type="image/avif"
            />
            <img [src]="'/assets/landing-page/' + section.id + '.avif'" />
          </picture>

          <div>
            <h4 class="headline-3">{{ section.headline | transloco }}</h4>
            <p [innerHTML]="section.content | transloco"></p>
          </div>
        </section>
      }
    }
  `,
})
export class EoLandingPageWhatComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private cd = inject(ChangeDetectorRef);

  private initialTransitionSectionId = 'sustainable-profile';
  private resizeObserver!: ResizeObserver;
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected translations = translations;
  protected showLarge = false;
  protected sections = signal<Section[]>([
    {
      id: this.initialTransitionSectionId,
      title: this.translations.landingPage.what.section1.title,
      headline: this.translations.landingPage.what.section1.headline,
      content: this.translations.landingPage.what.section1.content,
      images: [
        {
          zIndex: '1',
          width: '17.99vw',
          height: '24.47vw',
          x: '32.67vw',
          y: '32.08vw',
          srcset: `/assets/landing-page/how-can-energy-origin-help-my-business/production/Rectangle5.avif 1x,
              /assets/landing-page/how-can-energy-origin-help-my-business/production/Rectangle5@2x.avif 2x,
              /assets/landing-page/how-can-energy-origin-help-my-business/production/Rectangle5@3x.avif 3x`,
        },
        {
          zIndex: '2',
          width: '6.81vw',
          height: '5.89vw',
          x: '21.59vw',
          y: '15.31vw',
          srcset: `/assets/landing-page/how-can-energy-origin-help-my-business/production/Rectangle4.avif 1x,
              /assets/landing-page/how-can-energy-origin-help-my-business/production/Rectangle4@2x.avif 2x,
              /assets/landing-page/how-can-energy-origin-help-my-business/production/Rectangle4@3x.avif 3x`,
        },
        {
          zIndex: '3',
          width: '3.44vw',
          height: '4.43vw',
          x: '17.26vw',
          y: '49.70vw',
          srcset: `/assets/landing-page/how-can-energy-origin-help-my-business/production/Rectangle3.avif 1x,
              /assets/landing-page/how-can-energy-origin-help-my-business/production/Rectangle3@2x.avif 2x,
              /assets/landing-page/how-can-energy-origin-help-my-business/production/Rectangle3@3x.avif 3x`,
        },
      ],
    },
    {
      id: 'renewable-production',
      title: this.translations.landingPage.what.section2.title,
      headline: this.translations.landingPage.what.section2.headline,
      content: this.translations.landingPage.what.section2.content,
      images: [
        {
          zIndex: '1',
          width: '33vw',
          height: '45.97vw',
          x: '30.99vw',
          y: '32.44vw',
          srcset: `/assets/landing-page/how-can-energy-origin-help-my-business/consumption/Rectangle5.avif 1x,
            /assets/landing-page/how-can-energy-origin-help-my-business/consumption/Rectangle5@2x.avif 2x,
            /assets/landing-page/how-can-energy-origin-help-my-business/consumption/Rectangle5@3x.avif 3x`,
        },
        {
          zIndex: '2',
          width: '18.39vw',
          height: '13.10vw',
          x: '17.59vw',
          y: '45.11vw',
          srcset: `/assets/landing-page/how-can-energy-origin-help-my-business/consumption/Rectangle4.avif 1x,
            /assets/landing-page/how-can-energy-origin-help-my-business/consumption/Rectangle4@2x.avif 768w,
            /assets/landing-page/how-can-energy-origin-help-my-business/consumption/Rectangle4@3x.avif 1200w`,
        },
        {
          zIndex: '3',
          width: '13.89vw',
          height: '16.67vw',
          x: '43.78vw',
          y: '20.24vw',
          srcset: `/assets/landing-page/how-can-energy-origin-help-my-business/consumption/Rectangle3.avif 1x,
            /assets/landing-page/how-can-energy-origin-help-my-business/consumption/Rectangle3@2x.avif 768w,
            /assets/landing-page/how-can-energy-origin-help-my-business/consumption/Rectangle3@3x.avif 1200w`,
        },
      ],
    },
    {
      id: 'green-energy-trading',
      title: this.translations.landingPage.what.section3.title,
      headline: this.translations.landingPage.what.section3.headline,
      content: this.translations.landingPage.what.section3.content,
      images: [
        {
          zIndex: '1',
          width: '20.57vw',
          height: '16.01vw',
          transitionFrom: 0,
          x: '36.34vw',
          y: '13.56vw',
          srcset: `/assets/landing-page/how-can-energy-origin-help-my-business/branding/Rectangle5.avif 1x,
            /assets/landing-page/how-can-energy-origin-help-my-business/branding/Rectangle5@2x.avif 2x,
            /assets/landing-page/how-can-energy-origin-help-my-business/branding/Rectangle5@3x.avif 3x`,
        },
        {
          zIndex: '3',
          width: '18.39vw',
          height: '13.10vw',
          x: '21.10vw',
          y: '50vw',
          transitionFrom: 2,
          srcset: `/assets/landing-page/how-can-energy-origin-help-my-business/branding/Rectangle4.avif 300w,
            /assets/landing-page/how-can-energy-origin-help-my-business/branding/Rectangle4@2x.avif 2x,
            /assets/landing-page/how-can-energy-origin-help-my-business/branding/Rectangle4@3x.avif 3x`,
        },
        {
          zIndex: '2',
          width: '41.27vw',
          height: '27.58vw',
          x: '28.51vw',
          y: '33.04vw',
          transitionFrom: 1,
          srcset: `/assets/landing-page/how-can-energy-origin-help-my-business/branding/Rectangle3.avif 1x,
            /assets/landing-page/how-can-energy-origin-help-my-business/branding/Rectangle3@2x.avif 2x,
            /assets/landing-page/how-can-energy-origin-help-my-business/branding/Rectangle3@3x.avif 3x`,
        },
      ],
    },
  ]);
  protected activeSection = signal<Section>(this.sections()[0]);

  constructor() {
    afterNextRender(() => {
      this.resizeObserver = new ResizeObserver(() => {
        this.showLarge = this.isLarge();
        this.cd.detectChanges();
      });

      this.initialTransition();
      this.resizeObserver.observe(document.body);
    });

    this.showLarge = this.isLarge();
  }

  ngAfterViewInit(): void {
    this.route.fragment.pipe(filter((fragment) => !!fragment)).subscribe((fragment) => {
      this.activeSection.set(
        this.sections().find((section) => section.id === fragment) || this.sections()[0]
      );
    });
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  initialTransition() {
    setTimeout(() => {
      const images = [
        {
          width: '34.06vw',
          height: '31.08vw',
          x: '31.82vw',
          y: '33.73vw',
        },
        {
          width: '22.75vw',
          height: '18.39vw',
          x: '20.44vw',
          y: '18.85vw',
        },
        {
          width: '15.79vw',
          height: '13.51vw',
          x: '17.44vw',
          y: '50.19vw',
        },
      ];

      this.sections.set(
        this.sections().map((section) => {
          if (section.id !== this.initialTransitionSectionId) return section;

          return {
            ...section,
            images: section.images.map((image, index) => {
              return {
                ...image,
                ...images[index],
              };
            }),
          };
        })
      );

      if (this.activeSection().id === this.initialTransitionSectionId) {
        this.activeSection.set(this.sections()[0]);
      }
    }, 300);
  }

  private isLarge(): boolean {
    if (!this.isBrowser) return false;
    return window.innerWidth >= 1024;
  }
}
