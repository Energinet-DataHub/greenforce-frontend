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
import { Directive, OnInit, TemplateRef, ViewContainerRef, inject, input } from '@angular/core';

import { DhFeatureFlags } from './dh-feature-flags';
import { DhFeatureFlagsService } from './dh-feature-flags.service';

@Directive({ selector: '[dhFeatureFlag]', standalone: true })
export class DhFeatureFlagDirective implements OnInit {
  private templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private featureFlagsService = inject(DhFeatureFlagsService);

  dhFeatureFlag = input<DhFeatureFlags>();

  ngOnInit(): void {
    const isEnabled = this.featureFlagsService.isEnabled(this.dhFeatureFlag());

    if (isEnabled) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
