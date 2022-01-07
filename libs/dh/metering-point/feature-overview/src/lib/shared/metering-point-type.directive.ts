/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import {
  Directive,
  Input,
  NgModule,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { MeteringPointType } from '@energinet-datahub/dh/shared/data-access-api';
import { MeteringPointTypeMap } from './metering-point-type-map';

@Directive({
  selector: '[dhMeteringPointType]',
})
export class MeteringPointTypeDirective implements OnChanges {
  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() dhMeteringPointType: MeteringPointType | undefined

  @Input() dhMeteringPointTypeContent: string | undefined

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.dhMeteringPointType) {
      this.updateView();
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private updateView() {
    if (this.dhMeteringPointTypeContent && this.dhMeteringPointType) {
      for (const [content, meteringPointTypes] of Object.entries(MeteringPointTypeMap)) {
        if (content === this.dhMeteringPointTypeContent) {
          if (meteringPointTypes.includes(this.dhMeteringPointType) || meteringPointTypes[0] === 'All') {
            this.viewContainer.createEmbeddedView(this.templateRef);
          } else {
            this.viewContainer.clear();
          }
        }
      }
    }
  }
}

@NgModule({
  declarations: [MeteringPointTypeDirective],
  exports: [MeteringPointTypeDirective],
})
export class DhMeteringPointTypeDirectiveScam {}
