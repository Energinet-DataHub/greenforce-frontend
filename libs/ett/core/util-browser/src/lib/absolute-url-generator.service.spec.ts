import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GfBrowserConfigurationModule } from '@energinet-datahub/ett/core/util-browser';

import { AbsoluteUrlGenerator } from './absolute-url-generator.service';

describe(AbsoluteUrlGenerator.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GfBrowserConfigurationModule.forRoot(), RouterTestingModule],
    });
    service = TestBed.inject(AbsoluteUrlGenerator);
  });

  let service: AbsoluteUrlGenerator;

  it('generates an absolute URL from an app URL with leading slash', () => {
    const url = service.fromUrl('/test-report/2021');

    expect(url).toBe('http://localhost/test-report/2021');
  });

  it('generates an absolute URL from an app URL without leading slash', () => {
    const url = service.fromUrl('test-declaration/2021');

    expect(url).toBe('http://localhost/test-declaration/2021');
  });

  it('generates an absolute URL from router commands', () => {
    const url = service.fromCommands(['test-metering-point', 123]);

    expect(url).toBe('http://localhost/test-metering-point/123');
  });
});
