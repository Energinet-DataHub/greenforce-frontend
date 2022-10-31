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
import {
  Directive,
  Input,
  NgModule,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { MeteringPointType } from '@energinet-datahub/dh/shared/domain';

import {
  allMeteringPointTypes,
  MeteringPointTypeMapProperty,
  meteringPointTypeMap,
} from './metering-point-type-map';

@Directive({
  selector: '[dhShowForMeteringPointType]',
})
export class DhShowForMeteringPointTypeDirective implements OnChanges {
  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() dhShowForMeteringPointType: MeteringPointType | undefined;

  @Input() dhShowForMeteringPointTypeProperty:
    | MeteringPointTypeMapProperty
    | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dhShowForMeteringPointType) {
      this.updateView();
    }
  }

  private updateView() {
    if (
      this.dhShowForMeteringPointTypeProperty &&
      this.dhShowForMeteringPointType
    ) {
      const meteringPointTypes =
        meteringPointTypeMap[this.dhShowForMeteringPointTypeProperty];
      const [meteringPointType] = meteringPointTypes;

      if (
        meteringPointType === allMeteringPointTypes ||
        meteringPointTypes.includes(this.dhShowForMeteringPointType)
      ) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    }
  }
}

@NgModule({
  declarations: [DhShowForMeteringPointTypeDirective],
  exports: [DhShowForMeteringPointTypeDirective],
})
export class DhShowForMeteringPointTypeDirectiveScam {}
