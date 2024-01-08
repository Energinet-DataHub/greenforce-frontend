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
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import lottie, { AnimationItem } from 'lottie-web';

@Component({
  selector: 'eo-lottie',
  standalone: true,
  template: '<div #lottieContainer [style.width]="width" [style.height]="height"></div>',
})
export class EoLottieComponent implements OnInit, OnDestroy {
  @ViewChild('lottieContainer', { static: true }) lottieContainer!: ElementRef;
  @Input() animationData!: unknown;
  @Input() width: string = '100%';
  @Input() height: string = '100%';

  private animationInstance!: AnimationItem;

  ngOnInit(): void {
    this.animationInstance = lottie.loadAnimation({
      container: this.lottieContainer.nativeElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: this.animationData,
    });
  }

  ngOnDestroy(): void {
    if (this.animationInstance) {
      this.animationInstance.destroy();
    }
  }
}
