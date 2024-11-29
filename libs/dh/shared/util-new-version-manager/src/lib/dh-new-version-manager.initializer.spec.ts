import { TestBed } from '@angular/core/testing';
import { APP_INITIALIZER } from '@angular/core';
import { MockProvider } from 'ng-mocks';

import { dhNewVersionManagerInitializer } from './dh-new-version-manager.initializer';
import { DhNewVersionManager } from './dh-new-version-manager.service';

describe('dhNewVersionManagerInitializer', () => {
  it('is not initialized when the initializer is not imported', () => {
    const appInitializerToken = TestBed.inject(APP_INITIALIZER, null);

    expect(appInitializerToken).toBeNull();
  });

  it(`initializes during APP_INITIALIZER`, () => {
    // Arrange
    TestBed.configureTestingModule({
      providers: [
        dhNewVersionManagerInitializer,
        MockProvider(DhNewVersionManager, {
          init: jest.fn(),
        }),
      ],
    });

    // Act
    const newVersionManager = TestBed.inject(DhNewVersionManager);

    // Assert
    expect(newVersionManager.init).toHaveBeenCalled();
  });
});
