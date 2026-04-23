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
import { ErrorHandler, Injectable } from '@angular/core';

// Cap prevents an unbounded buffer if adopt() is never called (e.g. the
// dynamic import of @microsoft/applicationinsights-angularplugin-js fails).
const MAX_BUFFER_SIZE = 50;

/**
 * Delegates to ApplicationinsightsAngularpluginErrorService once the App Insights SDK
 * has been dynamically loaded. Errors raised before that happens are buffered and
 * replayed on adopt().
 *
 * Keeps @microsoft/applicationinsights-* out of the eager bundle while still capturing
 * bootstrap errors.
 */
@Injectable()
export class DhApplicationInsightsErrorHandler implements ErrorHandler {
  private delegate: ErrorHandler | null = null;
  private buffer: unknown[] = [];

  handleError(error: unknown): void {
    if (this.delegate) {
      this.delegate.handleError(error);
      return;
    }
    if (this.buffer.length < MAX_BUFFER_SIZE) {
      this.buffer.push(error);
    }
  }

  adopt(delegate: ErrorHandler): void {
    this.delegate = delegate;
    const queued = this.buffer;
    this.buffer = [];
    for (const err of queued) {
      try {
        delegate.handleError(err);
      } catch {
        // Swallow so one throwing delegate call does not prevent draining the rest.
      }
    }
  }
}
