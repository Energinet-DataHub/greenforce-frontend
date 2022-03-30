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
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Directive, Input, NgModule } from '@angular/core';
import { PushModule } from '@rx-angular/template';

import { EoMediaPresenter } from './eo-media.presenter';

const cssPropertyNameMaxWidthPercentage =
  '--eo-media-image-max-width-percentage';

@Directive({
  // changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[eo-media-image]',
  // styles: [
  //   `
  //     :host {
  //       display: block;
  //       flex: 1 1;

  //       /* max-width: 54.1666667%; // Image is max 520px in a 960px wrapper. */
  //       /* max-width: var(${cssPropertyNameMaxWidthPercentage}); */
  //       margin-left: 40px;
  //     }
  //   `,
  // ],
  // template: `
  //   <!-- <div [style.max-width.%]="mediaImageMaxWidthPercentage$ | push"> -->
  //   <ng-content></ng-content>
  //   <!-- </div> -->
  // `,
})
export class EoMediaImageDirective {
  @Input()
  set maxWidthPixels(value: number | null) {
    this.presenter.updateMediaImageMaxWidthPixels(value);
  }

  // @HostBinding('style.max-width.%')
  // styleMaxWidthPercentage: number | null = null;

  mediaImageMaxWidthPercentage$ = this.presenter.mediaImageMaxWidthPercentage$;

  constructor(
    private presenter: EoMediaPresenter,
    private changeDetector: ChangeDetectorRef
  ) {
    // this.mediaImageMaxWidthPercentage$.subscribe((maxWidthPercentage) => {
    //   this.styleMaxWidthPercentage = maxWidthPercentage;
    //   this.changeDetector.markForCheck();
    //   this.changeDetector.detectChanges();
    // });
  }
}

@NgModule({
  declarations: [EoMediaImageDirective],
  exports: [EoMediaImageDirective],
  imports: [CommonModule, PushModule],
})
export class EoMediaImageScam {}
