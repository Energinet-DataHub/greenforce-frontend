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
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eo-dragon',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
        .eo-dragon {
            width: 0;
            height: 0;
            position: relative;
            display: inline-block;
            opacity: 0;
        }
        .eo-dragon.fade-in {
            height: 400px;
            width: 400px;
            opacity: 1;
            transition: opacity 1s ease-in-out;
        }

        .eo-dragon * {
            box-sizing: border-box;
        }

        /* Dragon Body */
        .eo-dragon .dragon-body {
            position: absolute;
            width: 80px;
            height: 70px;
            background: linear-gradient(45deg, #8B4513, #A0522D);
            border-radius: 40px 40px 25px 25px;
            top: 220px;
            left: 160px;
            box-shadow: inset -6px -6px 12px rgba(0,0,0,0.3);
            z-index: 3;
        }

        /* Dragon Neck */
        .eo-dragon .dragon-neck {
            position: absolute;
            width: 35px;
            height: 80px;
            background: linear-gradient(45deg, #8B4513, #A0522D);
            border-radius: 17px;
            top: 160px;
            left: 182px;
            box-shadow: inset -3px -3px 8px rgba(0,0,0,0.3);
            z-index: 2;
            animation: eo-dragon-neckSway 4s ease-in-out infinite alternate;
        }

        @keyframes eo-dragon-neckSway {
            0% {
                transform: rotate(-2deg);
            }
            100% {
                transform: rotate(2deg);
            }
        }

        /* Dragon Head */
        .eo-dragon .dragon-head {
            position: absolute;
            width: 60px;
            height: 55px;
            background: linear-gradient(45deg, #8B4513, #CD853F);
            border-radius: 30px 30px 15px 15px;
            top: 130px;
            left: 170px;
            box-shadow: inset -4px -4px 10px rgba(0,0,0,0.3);
            z-index: 4;
            animation: eo-dragon-headBob 3s ease-in-out infinite alternate;
        }

        @keyframes eo-dragon-headBob {
            0% {
                transform: translateY(0px);
            }
            100% {
                transform: translateY(-3px);
            }
        }

        /* Dragon Snout */
        .eo-dragon .dragon-snout {
            position: absolute;
            width: 25px;
            height: 18px;
            background: linear-gradient(45deg, #A0522D, #D2691E);
            border-radius: 12px 12px 8px 8px;
            top: 22px;
            left: 17px;
        }

        /* Dragon Eyes */
        .eo-dragon .dragon-eye {
            position: absolute;
            width: 8px;
            height: 8px;
            background: #FF4500;
            border-radius: 50%;
            top: 12px;
            box-shadow: inset 1px 1px 2px rgba(0,0,0,0.5);
        }

        .eo-dragon .dragon-eye.left {
            left: 12px;
        }

        .eo-dragon .dragon-eye.right {
            right: 12px;
        }

        .eo-dragon .dragon-eye::after {
            content: '';
            position: absolute;
            width: 4px;
            height: 4px;
            background: #000;
            border-radius: 50%;
            top: 2px;
            left: 2px;
        }

        /* Dragon Horns */
        .eo-dragon .dragon-horn {
            position: absolute;
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 15px solid #654321;
            top: -10px;
        }

        .eo-dragon .dragon-horn.left {
            left: 15px;
            transform: rotate(-10deg);
        }

        .eo-dragon .dragon-horn.right {
            right: 15px;
            transform: rotate(10deg);
        }

        /* Dragon Wings */
        .eo-dragon .dragon-wing {
            position: absolute;
            width: 60px;
            height: 85px;
            background: linear-gradient(45deg, #8B0000, #DC143C);
            border-radius: 30px 8px 50px 15px;
            top: 170px;
            box-shadow: inset -6px -6px 12px rgba(0,0,0,0.4);
            z-index: 1;
        }

        /* Left wing */
        .eo-dragon .dragon-wing.left {
            right: 140px;
            transform-origin: bottom left;
            animation: eo-dragon-flap-left 2s ease-in-out infinite alternate;
        }

        /* Right wing */
        .eo-dragon .dragon-wing.right {
            right: 150px;
            transform-origin: bottom left;
            animation: eo-dragon-flap-right 2s ease-in-out infinite alternate;
            z-index: 2;
        }

        @keyframes eo-dragon-flap-left {
            0% {
                transform: rotateZ(10deg);
            }
            100% {
                transform: rotateZ(25deg);
            }
        }

        @keyframes eo-dragon-flap-right {
            0% {
                transform: scaleX(-1) rotateZ(0deg);
            }
            100% {
                transform: scaleX(-1) rotateZ(25deg);
            }
        }

        /* Wing Details */
        .eo-dragon .dragon-wing::after {
            content: '';
            position: absolute;
            width: 45px;
            height: 65px;
            background: linear-gradient(45deg, #B22222, #FF6347);
            border-radius: 22px 4px 35px 10px;
            top: 8px;
            left: 8px;
        }

        /* Dragon Tail */
        .eo-dragon .dragon-tail {
            position: absolute;
            width: 60px;
            height: 25px;
            background: linear-gradient(45deg, #8B4513, #A0522D);
            border-radius: 0 25px 25px 0;
            top: 260px;
            left: 180px;
            transform-origin: left center;
            animation: eo-dragon-tailWag 3s ease-in-out infinite alternate;
        }

        @keyframes eo-dragon-tailWag {
            0% {
                transform: scaleX(-1) rotate(-10deg);
            }
            100% {
                transform: scaleX(-1) rotate(10deg);
            }
        }

        @keyframes eo-dragon-tailWag-after {
            0% {
                transform: rotate(-10deg);
                top: 0;
            }
            100% {
                transform: rotate(10deg);
                top: 6px;
            }
        }

        .eo-dragon .dragon-tail::after {
            content: '';
            position: absolute;
            width: 35px;
            height: 18px;
            background: linear-gradient(45deg, #A0522D, #CD853F);
            border-radius: 0 18px 18px 0;
            left: 50px;
            animation: eo-dragon-tailWag-after 3s ease-in-out infinite alternate;
        }

        /* Dragon Legs */
        .eo-dragon .dragon-leg {
            position: absolute;
            width: 16px;
            height: 40px;
            background: linear-gradient(45deg, #654321, #8B4513);
            border-radius: 8px 8px 4px 4px;
            top: 280px;
            z-index: 3;
        }

        .eo-dragon .dragon-leg.front-left {
            left: 165px;
        }

        .eo-dragon .dragon-leg.front-right {
            left: 185px;
        }

        .eo-dragon .dragon-leg.back-left {
            left: 205px;
        }

        .eo-dragon .dragon-leg.back-right {
            left: 225px;
        }

        /* Dragon Claws */
        .eo-dragon .dragon-leg::after {
            content: '';
            position: absolute;
            width: 12px;
            height: 6px;
            background: #2F4F4F;
            border-radius: 0 0 6px 6px;
            bottom: -4px;
            left: 2px;
        }

        /* Fire Breath - ADJUSTED FOR NEW HEAD POSITION */
        .eo-dragon .dragon-fire {
            position: absolute;
            width: 50px;
            height: 20px;
            background: linear-gradient(90deg, #FF4500, #FFD700, transparent);
            border-radius: 30px 0 0 30px;
            top: 160px;
            left: 140px;
            opacity: 0;
            animation: eo-dragon-breathe 4s ease-in-out infinite;
            z-index: 10;
        }

        @keyframes eo-dragon-breathe {
            0%, 70% {
                opacity: 0;
                transform: scaleX(0);
            }
            75%, 85% {
                opacity: 1;
                transform: scaleX(1);
            }
            90%, 100% {
                opacity: 0;
                transform: scaleX(0);
            }
        }

        .eo-dragon .dragon-fire::after {
            content: '';
            position: absolute;
            width: 35px;
            height: 14px;
            background: linear-gradient(90deg, #FF6347, #FFA500, transparent);
            border-radius: 20px 0 0 20px;
            top: 3px;
            left: 8px;
        }

        /* Scales Effect */
        .eo-dragon .dragon-body::before,
        .eo-dragon .dragon-head::before,
        .eo-dragon .dragon-neck::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background-image:
                    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.4) 1px, transparent 1px),
                    radial-gradient(circle at 65% 45%, rgba(255,255,255,0.3) 1px, transparent 1px),
                    radial-gradient(circle at 85% 75%, rgba(255,255,255,0.4) 1px, transparent 1px);
            background-size: 12px 12px, 10px 10px, 15px 15px;
            border-radius: inherit;
        }

        /* Nostril Details */
        .eo-dragon .dragon-nostril {
            position: absolute;
            width: 3px;
            height: 4px;
            background: #654321;
            border-radius: 50%;
            top: 10px;
        }

        .eo-dragon .dragon-nostril.left {
            left: 6px;
        }

        .eo-dragon .dragon-nostril.right {
            right: 6px;
        }

        /* NEW: ENTRANCE FIRE EFFECTS */

        /* Fire burst container */
        .eo-dragon .entrance-fire-container {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 20;
            pointer-events: none;
            opacity: 0;
        }

        .eo-dragon.fade-in .entrance-fire-container {
            animation: eo-dragon-entrance-fire 2s ease-out forwards;
        }

        @keyframes eo-dragon-entrance-fire {
            0% {
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            80% {
                opacity: 1;
            }
            100% {
                opacity: 0;
            }
        }

        /* Central fire burst */
        .eo-dragon .fire-burst {
            position: absolute;
            width: 120px;
            height: 120px;
            background: radial-gradient(circle, rgba(255,165,0,0.8) 0%, rgba(255,69,0,0.6) 50%, rgba(255,0,0,0) 70%);
            border-radius: 50%;
            top: 140px;
            left: 140px;
            transform: scale(0);
            opacity: 0;
        }

        .eo-dragon.fade-in .fire-burst {
            animation: eo-dragon-fire-burst 1.5s ease-out forwards;
        }

        @keyframes eo-dragon-fire-burst {
            0% {
                transform: scale(0);
                opacity: 0;
            }
            20% {
                transform: scale(2);
                opacity: 0.9;
            }
            100% {
                transform: scale(3);
                opacity: 0;
            }
        }

        /* Fire particles */
        .eo-dragon .fire-particle {
            position: absolute;
            width: 10px;
            height: 10px;
            background: #FF4500;
            border-radius: 50%;
            top: 200px;
            left: 200px;
            transform: scale(0);
            opacity: 0;
            box-shadow: 0 0 10px 5px rgba(255,69,0,0.7);
        }

        .eo-dragon.fade-in .fire-particle {
            animation: eo-dragon-fire-particle 1.2s ease-out forwards;
        }

        .eo-dragon .fire-particle:nth-child(1) {
            animation-delay: 0.1s;
        }

        .eo-dragon .fire-particle:nth-child(2) {
            animation-delay: 0.2s;
        }

        .eo-dragon .fire-particle:nth-child(3) {
            animation-delay: 0.3s;
        }

        .eo-dragon .fire-particle:nth-child(4) {
            animation-delay: 0.15s;
        }

        .eo-dragon .fire-particle:nth-child(5) {
            animation-delay: 0.25s;
        }

        @keyframes eo-dragon-fire-particle {
            0% {
                transform: translate(0, 0) scale(0);
                opacity: 0;
            }
            10% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(
                        calc(var(--x-direction, 1) * 150px),
                        calc(var(--y-direction, 1) * 150px)
                ) scale(0);
                opacity: 0;
            }
        }

        /* Initial fire breath burst */
        .eo-dragon .initial-fire-breath {
            position: absolute;
            width: 0;
            height: 30px;
            background: linear-gradient(270deg, transparent, #FFD700, #FF4500);
            border-radius: 30px 30px 30px 30px;
            top: 160px;
            right: 200px;
            opacity: 0;
            z-index: 15;
            transform-origin: left center;
        }

        .eo-dragon.fade-in .initial-fire-breath {
            animation: eo-dragon-initial-fire 1.5s ease-out 0.5s forwards;
        }

        @keyframes eo-dragon-initial-fire {
            0% {
                width: 0;
                opacity: 0;
            }
            20% {
                width: 200px;
                opacity: 1;
            }
            70% {
                width: 150px;
                opacity: 0.8;
            }
            100% {
                width: 0;
                opacity: 0;
            }
        }

        /* Fire embers */
        .eo-dragon .fire-ember {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #FFD700;
            border-radius: 50%;
            opacity: 0;
        }

        .eo-dragon.fade-in .fire-ember {
            animation: eo-dragon-ember 2s ease-out forwards;
        }

        .eo-dragon .fire-ember:nth-child(1) {
            top: 150px;
            left: 100px;
            animation-delay: 0.7s;
        }

        .eo-dragon .fire-ember:nth-child(2) {
            top: 160px;
            left: 90px;
            animation-delay: 0.8s;
        }

        .eo-dragon .fire-ember:nth-child(3) {
            top: 140px;
            left: 110px;
            animation-delay: 0.9s;
        }

        .eo-dragon .fire-ember:nth-child(4) {
            top: 155px;
            left: 80px;
            animation-delay: 1s;
        }

        .eo-dragon .fire-ember:nth-child(5) {
            top: 145px;
            left: 70px;
            animation-delay: 1.1s;
        }

        @keyframes eo-dragon-ember {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            100% {
                transform: translate(
                        calc(var(--x-direction, -1) * 50px),
                        calc(var(--y-direction, -1) * 50px)
                ) scale(0);
                opacity: 0;
            }
        }
    `,
  ],
  template: `
    <div class="eo-dragon" [class.fade-in]="isShown()">
      <div class="dragon-wing left"></div>
      <div class="dragon-wing right"></div>
      <div class="dragon-tail"></div>
      <div class="dragon-neck"></div>
      <div class="dragon-body"></div>
      <div class="dragon-head">
        <div class="dragon-snout">
          <div class="dragon-nostril left"></div>
          <div class="dragon-nostril right"></div>
        </div>
        <div class="dragon-eye left"></div>
        <div class="dragon-eye right"></div>
        <div class="dragon-horn left"></div>
        <div class="dragon-horn right"></div>
      </div>
      <div class="dragon-leg front-left"></div>
      <div class="dragon-leg front-right"></div>
      <div class="dragon-leg back-left"></div>
      <div class="dragon-leg back-right"></div>
      <div class="dragon-fire"></div>

      <!-- New entrance fire effects -->
      <div class="entrance-fire-container">
        <!-- Central fire burst -->
        <div class="fire-burst"></div>

        <!-- Fire particles that shoot outward -->
        <div class="fire-particle" style="--x-direction: 1; --y-direction: -1;"></div>
        <div class="fire-particle" style="--x-direction: -1; --y-direction: 1;"></div>
        <div class="fire-particle" style="--x-direction: 1; --y-direction: 1;"></div>
        <div class="fire-particle" style="--x-direction: -1; --y-direction: -1;"></div>
        <div class="fire-particle" style="--x-direction: 0.5; --y-direction: -1.5;"></div>

        <!-- Initial fire breath burst -->
        <div class="initial-fire-breath"></div>

        <!-- Fire embers -->
        <div class="fire-ember" style="--x-direction: -1; --y-direction: -0.5;"></div>
        <div class="fire-ember" style="--x-direction: -1.2; --y-direction: 0.3;"></div>
        <div class="fire-ember" style="--x-direction: -0.8; --y-direction: -0.7;"></div>
        <div class="fire-ember" style="--x-direction: -1.5; --y-direction: 0.2;"></div>
        <div class="fire-ember" style="--x-direction: -0.9; --y-direction: -0.4;"></div>
      </div>
    </div>
  `,
})
export class DragonComponent {
  isShown = input(false);
}
