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
import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { EoAuthStore } from '../auth/auth.store';

const knownFeatures = [
  'accepted-terms',
  'dashboard',
  'production',
  'meters',
  'certificates',
  'daterange', // To show the date range picker
  'resolution', // To show the resolution component
] as const;
export type allowedFeatureFlags = typeof knownFeatures[number];

/**
 * This directive can be used to show/hide a component based on the feature flags that are currently enabled.
 * @example
 * <div onFeatureFlag="dashboard">Test</div>
 */
@Directive({
  selector: '[onFeatureFlag]',
  standalone: true,
})
export class EoFeatureFlagDirective implements AfterViewInit {
  /**
   * This directive can be used to show/hide a component based on the feature flags that are currently enabled.
   */
  @Input() onFeatureFlag: allowedFeatureFlags | undefined;

  constructor(private elementRef: ElementRef, private authStore: EoAuthStore) {}

  ngAfterViewInit() {
    this.authStore.getScope$.subscribe((flags) => {
      this.elementRef.nativeElement.style.display =
        this.onFeatureFlag && flags?.includes(this.onFeatureFlag) ? 'block' : 'none';
    });
  }
}
