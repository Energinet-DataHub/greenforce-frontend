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
import { NgClass, NgStyle } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';

interface Section {
  title?: string;
  id: string;
  headline: string;
  content: string;
  images: Image[];
}

interface Image {
  zIndex: string;
  main?: boolean;
  x?: string;
  y?: string;
  width: string;
  height: string;
  srcset: string;
  transform?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'eo-landing-page-what',
  imports: [NgClass, NgStyle],
  encapsulation: ViewEncapsulation.None,
  styles: `
    eo-landing-page-what {
      display: grid;
      padding: 0 137px;
      min-height: 100vh;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
      gap: 0px 0px;
      grid-template-areas:
        "images content";

      --on-light-high-emphasis: rgba(0, 0, 0, .87);

      .headline-4 {
        color: #02525E;
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
          font-size: 48px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          text-decoration: none;
          color: rgba(189, 189, 189, 0.87);

          &.active, &:hover {
            color: #0A515D;
          }

          &::after {
              content: '';
              display: block;
              width: 100%;
              height: 2px;
              background: #00847C;
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
        justify-content: center;
        align-items: center;

        img {
          position: absolute;
          transition: all 1500ms cubic-bezier(.77, 0, .28, 1);
          border-radius: 30px;
        }
      }

      .images-container {
        position: absolute;
      }

      .content {
        display: grid;
        grid-area: content;
        grid-template-columns: 1fr;
        grid-template-rows: 0.5fr 1fr 2fr;
        gap: 76px 0px;
        grid-template-areas:
          "headline"
          "nav"
          "content";
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
        }
      }

      .content-text {
        transition: opacity 1500ms cubic-bezier(.77, 0, .28, 1);
        height: 0;
      }
    }
  `,
  template: `
    <section aria-hidden class="images">
      @for (section of sections(); track section.id) {
        <div class="images-container" [ngClass]="{'active': section.id === activeSection().id}">
          @for (image of section.images; track image.srcset; let idx = $index) {
            <div class="image-container">
              <img
                src="small-image.jpg"
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
                  opacity: activeSection().id === section.id ? 1 : 0,
                  position: activeSection().images[idx].main ? 'relative' : 'absolute'
                }"
              />
            </div>
          }
        </div>
      }
    </section>

    <section class="content">
      <h2 class="headline headline-4">How can Energy Origin help my business?</h2>

      <nav>
        <ul>
          @for (section of sections(); track section.id) {
            <li>
              <a
                href="#{{ section.id }}"
                (click)="activeSection.set(section)"
                [ngClass]="{ active: activeSection().id === section.id }"
                >{{ section.title }}</a
              >
            </li>
          }
        </ul>
      </nav>

      @for (section of sections(); track section.id) {
        <div class="content-text" [style.opacity]="activeSection().id === section.id ? 1 : 0">
          <h3 class="headline-3">{{ section.headline }}</h3>
          <p>{{ section.content }}</p>
        </div>
      }
    </section>
  `,
})
export class EoLandingPageWhatComponent implements AfterViewInit {
  private route = inject(ActivatedRoute);
  private initialTransitionSectionId = 'sustainable-profile';

  protected sections = signal<Section[]>([
    {
      id: this.initialTransitionSectionId,
      title: 'Sustainable Profile',
      headline: 'Bolster investor and consumer trust with accurate reports',
      content:
        'With Energy Origin, businesses can confidently showcase their genuine contribution to a greener planet, bolstering investor and consumer trust while navigating the evolving landscape of sustainability reporting with ease and integrity.',
      images: [
        {
          zIndex: '1',
          main: true,
          width: '272px',
          height: '370px',
          srcset: `/assets/landing-page/how-can-energy-origin-help-my-business/production/Rectangle5.avif 500w,
              /assets/landing-page/how-can-energy-origin-help-my-business/production/Rectangle5@2x.avif 768w,
              /assets/landing-page/how-can-energy-origin-help-my-business/production/Rectangle5@3x.avif 1200w`,
        },
        {
          zIndex: '2',
          width: '103px',
          height: '89px',
          x: '-26px',
          y: '-450px',
          srcset: `/assets/landing-page/how-can-energy-origin-help-my-business/production/Rectangle4.avif 500w,
              /assets/landing-page/how-can-energy-origin-help-my-business/production/Rectangle4@2x.avif 768w,
              /assets/landing-page/how-can-energy-origin-help-my-business/production/Rectangle4@3x.avif 1200w`,
        },
        {
          zIndex: '3',
          width: '52px',
          height: '67px',
          x: '-100px',
          y: '50px',
          srcset: `/assets/landing-page/how-can-energy-origin-help-my-business/production/Rectangle3.avif 500w,
              /assets/landing-page/how-can-energy-origin-help-my-business/production/Rectangle3@2x.avif 768w,
              /assets/landing-page/how-can-energy-origin-help-my-business/production/Rectangle3@3x.avif 1200w`,
        },
      ],
    },
    {
      id: 'renewable-production',
      title: 'Renewable Production',
      headline: 'Increase earnings with higher demands for transparency about sustainability',
      content: `Our precise, granular certification process not only simplifies compliance with stringent EU regulations but also enhances the credibility of companies' sustainability reports.`,
      images: [
        {
          zIndex: '1',
          main: true,
          width: '499px',
          height: '695px',
          srcset: `/assets/landing-page/how-can-energy-origin-help-my-business/consumption/Rectangle5.avif 500w,
            /assets/landing-page/how-can-energy-origin-help-my-business/consumption/Rectangle5@2x.avif 768w,
            /assets/landing-page/how-can-energy-origin-help-my-business/consumption/Rectangle5@3x.avif 1200w`,
        },
        {
          zIndex: '2',
          width: '278px',
          height: '198px',
          x: '50px',
          y: '-180px',
          srcset: `/assets/landing-page/how-can-energy-origin-help-my-business/consumption/Rectangle4.avif 500w,
            /assets/landing-page/how-can-energy-origin-help-my-business/consumption/Rectangle4@2x.avif 768w,
            /assets/landing-page/how-can-energy-origin-help-my-business/consumption/Rectangle4@3x.avif 1200w`,
        },
        {
          zIndex: '3',
          width: '210px',
          height: '252px',
          x: '450px',
          y: '-530px',
          srcset: `/assets/landing-page/how-can-energy-origin-help-my-business/consumption/Rectangle3.avif 500w,
            /assets/landing-page/how-can-energy-origin-help-my-business/consumption/Rectangle3@2x.avif 768w,
            /assets/landing-page/how-can-energy-origin-help-my-business/consumption/Rectangle3@3x.avif 1200w`,
        },
      ],
    },
    {
      id: 'green-energy-trading',
      title: 'Green Energy Trading',
      headline: 'Help the market juggle granular certificates and connect digital wallets',
      content:
        'With such high demands for showcasing and proving sources used in production, we expect that marketplaces will evolve, aiding companies in buying green energy at the right time, to match their consumption.',
      images: [
        {
          zIndex: '2',
          main: true,
          width: '624px',
          height: '417px',
          srcset: `/assets/landing-page/how-can-energy-origin-help-my-business/branding/Rectangle3.avif 500w,
            /assets/landing-page/how-can-energy-origin-help-my-business/branding/Rectangle3@2x.avif 768w,
            /assets/landing-page/how-can-energy-origin-help-my-business/branding/Rectangle3@3x.avif 1200w`,
        },
        {
          zIndex: '1',
          width: '278px',
          height: '198px',
          x: '430px',
          y: '-500px',
          srcset: `/assets/landing-page/how-can-energy-origin-help-my-business/branding/Rectangle5.avif 500w,
            /assets/landing-page/how-can-energy-origin-help-my-business/branding/Rectangle5@2x.avif 768w,
            /assets/landing-page/how-can-energy-origin-help-my-business/branding/Rectangle5@3x.avif 1200w`,
        },
        {
          zIndex: '2',
          width: '311px',
          height: '242px',
          x: '220px',
          y: '0px',
          srcset: `/assets/landing-page/how-can-energy-origin-help-my-business/branding/Rectangle4.avif 300w,
            /assets/landing-page/how-can-energy-origin-help-my-business/branding/Rectangle4@2x.avif 768w,
            /assets/landing-page/how-can-energy-origin-help-my-business/branding/Rectangle4@3x.avif 1200w`,
        },
      ],
    },
  ]);
  protected activeSection = signal<Section>(this.sections()[0]);

  ngAfterViewInit(): void {
    this.route.fragment.pipe(filter((fragment) => !!fragment)).subscribe((fragment) => {
      this.activeSection.set(
        this.sections().find((section) => section.id === fragment) || this.sections()[0]
      );
    });
    this.initialTransition();
  }

  initialTransition() {
    setTimeout(() => {
      const images = [
        {
          width: '515px',
          height: '470px',
        },
        {
          width: '344px',
          height: '278px',
          x: '80px',
          y: '-500px',
        },
        {
          width: '238px',
          height: '204px',
          x: '26px',
          y: '0px',
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

      if(this.activeSection().id === this.initialTransitionSectionId) {
        this.activeSection.set(this.sections()[0]);
      }
    }, 300);
  }
}
