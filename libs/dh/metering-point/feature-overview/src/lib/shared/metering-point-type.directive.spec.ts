import { MockBuilder, MockRender } from 'ng-mocks';
import { MeteringPointTypeDirective } from './metering-point-type.directive';

describe('MeteringPointTypeDirective', () => {
  beforeEach(() => MockBuilder(MeteringPointTypeDirective));

  it('renders div', () => {
    const fixture = MockRender(
      `
        <div *dhMeteringPointType="'E17'; content:'netSettlementGroup'">
          test
        </div>
      `
    );
    expect(fixture.nativeElement.innerHTML).toContain('test');
  });

  it('does not render div', () => {
    const fixture = MockRender(
      `
        <div *dhMeteringPointType="'E20'; content:'netSettlementGroup'">
          test
        </div>
      `
    );
    expect(fixture.nativeElement.innerHTML).not.toContain('test');
  });
});
