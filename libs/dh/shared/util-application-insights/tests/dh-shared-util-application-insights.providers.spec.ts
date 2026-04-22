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
import { TestBed } from '@angular/core/testing';
import { APP_INITIALIZER, ErrorHandler } from '@angular/core';

import { applicationInsightsProviders } from '../src/dh-shared-util-application-insights.providers';
import { DhApplicationInsights } from '../src/dh-application-insights.service';
import { DhApplicationInsightsErrorHandler } from '../src/dh-application-insights-error-handler';

describe('applicationInsightsProviders', () => {
  it('Application Insights is not initialized when the Angular module is not imported', () => {
    const appInitializerToken = TestBed.inject(APP_INITIALIZER, null);

    expect(appInitializerToken).toBeNull();
  });

  it(`initializes Application Insights during APP_INITIALIZER`, () => {
    // Arrange
    TestBed.configureTestingModule({
      providers: [
        applicationInsightsProviders,
        {
          provide: DhApplicationInsights,
          useValue: {
            init: vi.fn(),
          },
        },
      ],
    });

    // Act
    const applicationInsights = TestBed.inject(DhApplicationInsights);

    // Assert
    expect(applicationInsights.init).toHaveBeenCalled();
  });

  it('provides a DhApplicationInsightsErrorHandler that delegates to the real handler once adopted', () => {
    // Arrange
    TestBed.configureTestingModule({
      providers: [
        applicationInsightsProviders,
        {
          provide: DhApplicationInsights,
          useValue: { init: vi.fn() },
        },
      ],
    });

    // Act
    const errorHandler = TestBed.inject(ErrorHandler);
    const wrapper = TestBed.inject(DhApplicationInsightsErrorHandler);
    const delegate = { handleError: vi.fn() };
    wrapper.adopt(delegate);
    const err = new Error('boom');
    errorHandler.handleError(err);

    // Assert
    expect(errorHandler).toBeInstanceOf(DhApplicationInsightsErrorHandler);
    expect(errorHandler).toBe(wrapper);
    expect(delegate.handleError).toHaveBeenCalledWith(err);
  });
});
