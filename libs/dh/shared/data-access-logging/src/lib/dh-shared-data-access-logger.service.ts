import { Injectable } from '@angular/core';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { DhApplicationInsights } from '@energinet-datahub/dh/shared/configuration-application-insights';

@Injectable({
  providedIn: 'root',
})
export class DhSharedDataAccessLogger {
  constructor(private appInsights: DhApplicationInsights) {}

  /**
   * Log a user action or other occurrence.
   * @param name
   */
  trackEvent(name: string): void {
    this.appInsights.trackEvent(name);
  }

  /**
   * Log a diagnostic scenario such entering or leaving a function.
   * @param message
   */
  trackTrace(message: string): void {
    this.appInsights.trackTrace(message);
  }

  /**
   * Logs that a page, or similar container was displayed to the user.
   * @param name
   */
  trackPageView(name: string): void {
    this.appInsights.trackPageView(name);
  }

  /**
   * Log an exception that you have caught.
   * @param exception
   */
  trackException(exception: Error, severityLevel: SeverityLevel): void {
    this.appInsights.trackException(exception, severityLevel);
  }
}
