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
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'eo-landing-page-why',
  encapsulation: ViewEncapsulation.None,
  styles: `
    eo-landing-page-why {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10vh 24px;
      width: 100%;
      background: #00363F;
      overflow: hidden;
      position: relative;

      @media only screen and (min-width: 860px) {
        padding: 16vh 0;
      }
    }

    eo-landing-page-why .background-image {
      opacity: 0.2;
      object-fit: cover;
      object-position: center;
      min-height: 100%;
      min-width: 100%;
      max-width: none;
      position: absolute;
      top: 0;
      left: 0;
    }

    eo-landing-page-why blockquote {
      text-align: center;
      position: relative;
      z-index: 1;

      p {
        color: #FFF;
        font-size: 28px;
        line-height: 34px;
        margin-top: 28px;
        font-weight: 400;

        @media only screen and (min-width: 860px) {
          font-size: 48px;
          line-height: 50px;
        }
      }

      footer {
        margin-top: 32px;
        @media only screen and (min-width: 860px) {
          margin-top: 64px;
        }
      }

      cite {
        color: #13ECB8;
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        letter-spacing: 0.54px;
        text-transform: uppercase;
      }
    }
  `,
  template: `
    <picture>
      <img
        class="background-image"
        sizes="(max-width: 4033px) 100vw, 4033px"
        srcset="
          /assets/landing-page/solar-cells/solar-cells_f715xq_c_scale,w_360.jpg   360w,
          /assets/landing-page/solar-cells/solar-cells_f715xq_c_scale,w_1411.jpg 1411w,
          /assets/landing-page/solar-cells/solar-cells_f715xq_c_scale,w_2046.jpg 2046w,
          /assets/landing-page/solar-cells/solar-cells_f715xq_c_scale,w_4033.jpg 4033w
        "
        src="/assets/landing-page/solar-cells/solar-cells_f715xq_c_scale,w_4033.jpg"
        alt=""
      />
    </picture>

    <blockquote>
      <picture>
        <source
          srcset="
            /assets/landing-page/martin-lundoe.avif    1x,
            /assets/landing-page/martin-lundoe@2x.avif 2x,
            /assets/landing-page/martin-lundoe@3x.avif 3x
          "
          type="image/avif"
        />
        <img
          alt="Martin Lervad Lundø - Vice President & CEO, Energinet DataHub"
          src="/assets/landing-page/martin-lundoe.avif"
        />
      </picture>

      <p>
        “We want the industry to<br />
        believe in true, sustainable energy<br />
        and eradicate greenwashing<br />
        through ground-breaking<br />
        new technology.”
      </p>
      <footer>
        <cite
          >Martin Lervad Lundø<br />
          Vice President & CEO, Energinet DataHub</cite
        >
      </footer>
    </blockquote>
  `,
})
export class EoLandingPageWhyComponent {}
