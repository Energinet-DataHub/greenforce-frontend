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
import { ErrorHandler } from '@angular/core';
import { ApplicationinsightsAngularpluginErrorService } from '@microsoft/applicationinsights-angularplugin-js';

import { applicationInsightsProviders } from './dh-shared-util-application-insights.providers';
import { DhApplicationInsights } from './dh-application-insights.service';

describe('applicationInsightsProviders', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('provides ApplicationinsightsAngularpluginErrorService as the ErrorHandler', () => {
    // Arrange & Act
    TestBed.configureTestingModule({
      providers: [applicationInsightsProviders],
    });
    const errorHandler = TestBed.inject(ErrorHandler);

    // Assert
    expect(errorHandler).toBeInstanceOf(ApplicationinsightsAngularpluginErrorService);
  });

  it('provides DhApplicationInsights service', () => {
    // Arrange
    TestBed.configureTestingModule({
      providers: [applicationInsightsProviders],
    });
    
    // Act
    const applicationInsights = TestBed.inject(DhApplicationInsights);

    // Assert
    expect(applicationInsights).toBeDefined();
    expect(applicationInsights).toBeInstanceOf(DhApplicationInsights);
  });
});
