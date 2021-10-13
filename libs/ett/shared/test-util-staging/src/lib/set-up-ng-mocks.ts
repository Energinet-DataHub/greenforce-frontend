import { ngMocks } from 'ng-mocks';

export function setUpNgMocks(): void {
  ngMocks.autoSpy('jest');
}
