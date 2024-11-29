import { TestBed } from '@angular/core/testing';
import { importProvidersFrom } from '@angular/core';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';

import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { DhNewVersionManager } from './dh-new-version-manager.service';

describe(DhNewVersionManager, () => {
  it(`displays a dialog when new version is ready`, () => {
    // Arrange
    TestBed.configureTestingModule({
      providers: [
        importProvidersFrom(getTranslocoTestingModule()),
        MockProvider(SwUpdate, {
          versionUpdates: of<VersionReadyEvent>({
            type: 'VERSION_READY',
            currentVersion: { hash: 'hash-current' },
            latestVersion: { hash: 'hash-latest' },
          }),
        }),
        MockProvider(WattToastService, {
          open: jest.fn(),
        }),
      ],
    });

    // Act
    const newVersionManager = TestBed.inject(DhNewVersionManager);
    const toastService = TestBed.inject(WattToastService);

    newVersionManager.init();

    // Assert
    expect(toastService.open).toHaveBeenCalled();
  });
});
