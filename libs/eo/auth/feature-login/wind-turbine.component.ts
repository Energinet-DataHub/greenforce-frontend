//#region License
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
//#endregion
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragonComponent } from './dragon.component';

@Component({
  selector: 'eo-wind-turbine',
  standalone: true,
  imports: [CommonModule, DragonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .eo-wind-turbine {
        position: relative;
        overflow: hidden;
        opacity: 1;
        transition: opacity 0.5s ease-in-out;
      }

      .eo-wind-turbine__pole {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
        z-index: 3;
        transform-origin: bottom center;
        animation: eoWindTurbineSway 10s ease-in-out infinite;
      }

      .eo-wind-turbine__base {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 4px;
        z-index: 4;
      }

      .eo-wind-turbine__head {
        position: absolute;
        border-radius: 4px;
        background-color: #64748b;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
        z-index: 5;
        transform: translateZ(0);
      }

      .eo-wind-turbine__blades-container {
        position: absolute;
        z-index: 6;
        transform-style: preserve-3d;
        will-change: transform;
      }

      .eo-wind-turbine__blade {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 40% 40% 5% 5%;
        transform-origin: center bottom;
        z-index: 6;
      }

      .eo-wind-turbine__blade--two {
        transform: translateX(-50%) rotate(120deg);
      }

      .eo-wind-turbine__blade--three {
        transform: translateX(-50%) rotate(-120deg);
      }

      .eo-wind-turbine__hub {
        position: absolute;
        border-radius: 9999px;
        background-color: #475569;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
        z-index: 7;
      }

      @keyframes eoWindTurbineSpin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes eoWindTurbineSway {
        0%,
        100% {
          transform: translateX(-50%) rotate(0deg);
        }
        25% {
          transform: translateX(-50%) rotate(0.3deg);
        }
        75% {
          transform: translateX(-50%) rotate(-0.3deg);
        }
      }

      .eo-wind-turbine.fade-out {
        opacity: 0;
        height: 0 !important;
      }
    `,
  ],
  template: `
    <eo-dragon (click)="reset()" [isShown]="dragonClicked" class="dragon" />
    <div
      (click)="increaseClicks()"
      class="eo-wind-turbine"
      [style.height.px]="height"
      [style.width.px]="width"
      [class.fade-out]="speed >= maxSpeed"
    >
      <div
        class="eo-wind-turbine__pole"
        [style.backgroundColor]="poleColor"
        [style.width.px]="width * 0.06"
        [style.height.px]="height * 0.7"
      ></div>

      <div
        class="eo-wind-turbine__base"
        [style.backgroundColor]="poleColor"
        [style.width.px]="width * 0.15"
        [style.height.px]="height * 0.05"
      ></div>

      <div
        class="eo-wind-turbine__head"
        [style.width.px]="width * 0.15"
        [style.height.px]="width * 0.15"
        [style.left.px]="width / 2 - (width * 0.15) / 2"
        [style.top.px]="height * 0.3 - (width * 0.15) / 2"
      ></div>

      <div
        class="eo-wind-turbine__blades-container"
        [style.width.px]="width * 0.8"
        [style.height.px]="width * 0.8"
        [style.left.px]="width / 2 - (width * 0.8) / 2"
        [style.top.px]="height * 0.3 - (width * 0.8) / 2"
        [style.animation]="
          'eoWindTurbineSpin ' + 20 / (rotationSpeed + speed) + 's linear infinite'
        "
      >
        <div
          class="eo-wind-turbine__blade"
          [style.backgroundColor]="bladeColor"
          [style.width.px]="width * 0.08"
          [style.height.px]="width * 0.35"
          [style.top.px]="width * 0.05"
        ></div>

        <div
          class="eo-wind-turbine__blade eo-wind-turbine__blade--two"
          [style.backgroundColor]="bladeColor"
          [style.width.px]="width * 0.08"
          [style.height.px]="width * 0.35"
          [style.top.px]="width * 0.05"
        ></div>

        <div
          class="eo-wind-turbine__blade eo-wind-turbine__blade--three"
          [style.backgroundColor]="bladeColor"
          [style.width.px]="width * 0.08"
          [style.height.px]="width * 0.35"
          [style.top.px]="width * 0.05"
        ></div>
      </div>

      <div
        class="eo-wind-turbine__hub"
        [style.width.px]="width * 0.1"
        [style.height.px]="width * 0.1"
        [style.left.px]="width / 2 - (width * 0.1) / 2"
        [style.top.px]="height * 0.3 - (width * 0.1) / 2"
      ></div>
    </div>
  `,
})
export class WindTurbineComponent {
  @Input() height = 300;
  @Input() width = 200;
  @Input() bladeColor = '#cccccc';
  @Input() poleColor = '#cccccc';
  @Input() rotationSpeed = 5;

  protected speed = 0;
  protected baseHue = 0; // Red is 0 in HSL
  protected baseSaturation = 0; // Start with gray (0% saturation)
  protected baseLightness = 80; // #cccccc is about 80% lightness
  protected maxSpeed = 100;
  protected dragonClicked = false;

  increaseClicks() {
    this.speed += 10;
    const saturation = Math.min(this.baseSaturation + this.speed, 100);
    this.bladeColor = `hsl(${this.baseHue}, ${saturation}%, ${this.baseLightness}%)`;

    if (this.speed >= this.maxSpeed) {
      // Add delay before resetting to allow fade animation to complete
      this.dragonClicked = true;
    }
  }

  reset() {
    this.dragonClicked = false;
    this.speed = 0;
    this.bladeColor = '#cccccc';
    this.baseSaturation = 0; // Reset saturation to gray
    this.baseHue = 0; // Reset hue to red
    this.baseLightness = 80; // Reset lightness to 80%
  }
}
