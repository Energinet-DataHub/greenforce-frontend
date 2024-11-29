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
import { MockProvider } from 'ng-mocks';
import { ApplicationinsightsAngularpluginErrorService } from '@microsoft/applicationinsights-angularplugin-js';

import { applicationInsightsProviders } from './dh-shared-util-application-insights.providers';
import { DhApplicationInsights } from './dh-application-insights.service';

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
        MockProvider(DhApplicationInsights, {
          init: jest.fn(),
        }),
      ],
    });

    // Act
    const applicationInsights = TestBed.inject(DhApplicationInsights);

    // Assert
    expect(applicationInsights.init).toHaveBeenCalled();
  });

  it(`provides ${ApplicationinsightsAngularpluginErrorService.name}`, () => {
    // Arrange
    TestBed.configureTestingModule({
      providers: [applicationInsightsProviders],
    });

    // Act
    const errorHandler = TestBed.inject(ErrorHandler);

    // Assert
    expect(errorHandler).toBeInstanceOf(ApplicationinsightsAngularpluginErrorService);
  });
});
