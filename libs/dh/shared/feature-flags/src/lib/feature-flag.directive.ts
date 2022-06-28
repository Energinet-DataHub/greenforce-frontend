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
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { DhFeatureFlags } from './feature-flags';
import { DhFeatureFlagsService } from './feature-flags.service';

@Directive({ selector: '[dhFeatureFlag]' })
export class DhFeatureFlagDirective {
  private isViewCreated = false;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private featureFlagsService: DhFeatureFlagsService
  ) {}

  @Input() set dhFeatureFlag(featureFlagName: DhFeatureFlags) {
    const isEnabled = this.featureFlagsService.isEnabled(featureFlagName);

    if (isEnabled && !this.isViewCreated) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isViewCreated = true;
    } else if (!isEnabled && this.isViewCreated) {
      this.viewContainer.clear();
      this.isViewCreated = false;
    }
  }
}

@NgModule({
  declarations: [DhFeatureFlagDirective],
  exports: [DhFeatureFlagDirective],
})
export class DhFeatureFlagDirectiveModule {}
