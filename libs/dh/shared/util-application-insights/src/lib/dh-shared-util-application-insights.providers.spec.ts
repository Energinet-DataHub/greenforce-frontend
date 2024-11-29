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
