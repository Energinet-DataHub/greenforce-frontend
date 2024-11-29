import { ngMocks } from 'ng-mocks';

/**
 * Configure ng-mocks for Jest.
 */
export function setUpNgMocks(): void {
  ngMocks.autoSpy('jest');
}
