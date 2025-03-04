import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eo-wind-turbine',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .eo-wind-turbine {
      position: relative;
    }

    .eo-wind-turbine__pole {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
    }

    .eo-wind-turbine__base {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 4px;
    }

    .eo-wind-turbine__head {
      position: absolute;
      border-radius: 4px;
      background-color: #64748b;
    }

    .eo-wind-turbine__blades-container {
      position: absolute;
    }

    .eo-wind-turbine__blade {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 9999px;
    }

    .eo-wind-turbine__blade--two {
      transform: translateX(-50%) rotate(120deg);
      transform-origin: center bottom;
    }

    .eo-wind-turbine__blade--three {
      transform: translateX(-50%) rotate(-120deg);
      transform-origin: center bottom;
    }

    .eo-wind-turbine__hub {
      position: absolute;
      border-radius: 9999px;
      background-color: #475569;
    }

    @keyframes eoWindTurbineSpin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `],
  template: `
    <div class="eo-wind-turbine" [style.height.px]="height" [style.width.px]="width">
      <div
        class="eo-wind-turbine__pole"
        [style.backgroundColor]="poleColor"
        [style.width.px]="width * 0.06"
        [style.height.px]="height * 0.7">
      </div>

      <div
        class="eo-wind-turbine__base"
        [style.backgroundColor]="poleColor"
        [style.width.px]="width * 0.15"
        [style.height.px]="height * 0.05">
      </div>

      <div
        class="eo-wind-turbine__head"
        [style.width.px]="width * 0.15"
        [style.height.px]="width * 0.15"
        [style.left.px]="width / 2 - (width * 0.15) / 2"
        [style.top.px]="height * 0.3 - (width * 0.15) / 2">
      </div>

      <div
        class="eo-wind-turbine__blades-container"
        [style.width.px]="width * 0.8"
        [style.height.px]="width * 0.8"
        [style.left.px]="width / 2 - (width * 0.8) / 2"
        [style.top.px]="height * 0.3 - (width * 0.8) / 2"
        [style.animation]="'eoWindTurbineSpin ' + (20 / rotationSpeed) + 's linear infinite'">

        <div
          class="eo-wind-turbine__blade"
          [style.backgroundColor]="bladeColor"
          [style.width.px]="width * 0.08"
          [style.height.px]="width * 0.35"
          [style.top.px]="width * 0.05">
        </div>

        <div
          class="eo-wind-turbine__blade eo-wind-turbine__blade--two"
          [style.backgroundColor]="bladeColor"
          [style.width.px]="width * 0.08"
          [style.height.px]="width * 0.35"
          [style.top.px]="width * 0.05">
        </div>

        <div
          class="eo-wind-turbine__blade eo-wind-turbine__blade--three"
          [style.backgroundColor]="bladeColor"
          [style.width.px]="width * 0.08"
          [style.height.px]="width * 0.35"
          [style.top.px]="width * 0.05">
        </div>
      </div>

      <div
        class="eo-wind-turbine__hub"
        [style.width.px]="width * 0.1"
        [style.height.px]="width * 0.1"
        [style.left.px]="width / 2 - (width * 0.1) / 2"
        [style.top.px]="height * 0.3 - (width * 0.1) / 2">
      </div>
    </div>
  `
})
export class WindTurbineComponent {
  @Input() height = 300;
  @Input() width = 200;
  @Input() bladeColor = 'rgb(0,0,0)';
  @Input() poleColor = '#0eb771';
  @Input() rotationSpeed = 5;
}
