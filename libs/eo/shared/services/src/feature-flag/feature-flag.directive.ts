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
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgModule,
} from '@angular/core';
import {
  allowedFeatureFlags,
  FeatureFlagService,
} from './feature-flag.service';

@Directive({
  selector: '[onFeatureFlag]',
})
/**
 * This directive can be used to show/hide a component based on the feature flags that are currently enabled.
 * @example
 * <div [onFeatureFlag]="'winter'">Test</div>
 *
 * To Enable: Append something like this '?enableFeature=daterange' to the URL
 * To Disable: Append something like this '?disableFeature=daterange' to the URL
 */
export class EoFeatureFlagDirective implements AfterViewInit {
  /**
   * This directive can be used to show/hide a component based on the feature flags that are currently enabled.
   * Look in Feature-flag service for list of currently supported flags.
   */
  @Input() onFeatureFlag: allowedFeatureFlags | undefined;

  constructor(
    private elementRef: ElementRef,
    private featureFlagService: FeatureFlagService
  ) {
    this.elementRef.nativeElement.style.display = 'none';
  }

  ngAfterViewInit() {
    if (
      this.onFeatureFlag &&
      this.featureFlagService.isFlagEnabled(this.onFeatureFlag)
    ) {
      this.elementRef.nativeElement.style.display = 'block';
    }
  }
}

@NgModule({
  declarations: [EoFeatureFlagDirective],
  exports: [EoFeatureFlagDirective],
})
export class EoFeatureFlagScam {}
